//@ts-check

/** @import {} from './types.ts' */

import {join} from 'node:path'
import {readFile, readdir} from 'node:fs/promises'

import leven from 'leven';

import {parseTraits} from './languages/shared.js'


// directory conventions of https://github.com/Kamalisk/arkhamdb-json-data
export const packsDir = 'pack'
export const translationDir = 'translations'

/** @type {TranslatableProperty[]} */
export const translatableProperties = ['name', 'traits', 'text', 'flavor', 'back_name', 'back_flavor', 'back_text'];

/** @typedef {import("./languages/model.js")} LanguageModule */


/**
 * 
 * @param {string} arkhamDataRootDir 
 * @returns 
 */
export function getReferencePackList(arkhamDataRootDir){
    const referencePacksDirectory = join(arkhamDataRootDir, packsDir)
    return readdir(referencePacksDirectory)
}

/**
 * 
 * @param {string} arkhamDataRootDir 
 * @param {string} pack 
 * @returns 
 */
export function getPackFileList(arkhamDataRootDir, pack){
    const packDirectory = join(arkhamDataRootDir, packsDir, pack)
    return readdir(packDirectory)
}





/**
 * Verify that traits are the same 
 * 
 * @param {string} referenceTraitsString 
 * @param {string} translationTraitsString 
 * @param {Set<string>} sameTranslationTraits 
 */
function areTraitsTranslated(referenceTraitsString, translationTraitsString, sameTranslationTraits){
    const referenceTraits = parseTraits(referenceTraitsString)
    const translationTraits = parseTraits(translationTraitsString)

    return referenceTraits.every((trait, i) => {
        const correspondingTranslationTrait = translationTraits[i]
        return trait !== correspondingTranslationTrait || sameTranslationTraits.has(correspondingTranslationTrait || '')
    })

}


/**
 * This is meant to be an approximation
 * 
 * @param {Card} translationCard 
 * @param {Card} referenceCard
 * @param {LanguageModule} languageModule 
 * @returns {MissingTranslation[]}
 */
export function findMissingTranslations(translationCard, referenceCard, languageModule){
    //console.log('findMissingTranslations', translationCard, referenceCard)

    /** @type {ReturnType<findMissingTranslations>} */
    const missingTranslations = []

    for(const prop of translatableProperties){
        const referenceText = referenceCard[prop];
        const translationText = translationCard[prop];

        if(referenceText && referenceText.length >= 1){ // is there something to translate?

            if(prop === 'traits'){
                if(!areTraitsTranslated(referenceText, translationText || '', languageModule.sameTranslationTraits)){
                    missingTranslations.push({
                        referenceCard,
                        translationCard,
                        property: prop
                    })
                }
            }
            else{
                if(prop === 'name' || prop === 'back_name'){
                    const referenceCardTraits = referenceCard.traits ? parseTraits(referenceCard.traits) : [];

                    if(
                        referenceCard.type_code === 'investigator' || 
                        (referenceCard.type_code === 'asset' && (referenceCardTraits.includes('Ally') || referenceCardTraits.includes('Humanoid') || referenceCardTraits.includes('Bystander') || referenceCardTraits.includes('Cultist')) && referenceCard.is_unique) || 
                        (referenceCard.type_code === 'enemy' && referenceCard.is_unique)
                    ){
                        // names of unique people/enemies aren't translated
                    }
                    else{
                        if(translationText === referenceText && !languageModule.sameTranslationNames.has(translationText)){
                            missingTranslations.push({
                                referenceCard,
                                translationCard,
                                property: prop
                            })
                        }
                    }

                }
                else{
                    if(prop === 'flavor'){
                        if(translationText === referenceText && !languageModule.sameTranslationFlavor.has(translationText)){
                            missingTranslations.push({
                                referenceCard,
                                translationCard,
                                property: prop
                            })
                        }
                    }
                    else{
                        // base case, if referenceText and translationText are very close, a translation is missing
                        const maxDistance = referenceText.length*5/100
                        const levDistance = leven(referenceText, translationText || '', {maxDistance});
                        //const levDistance = leven(referenceText, translationText || '');
                        
                        const threshold = maxDistance-1

                        //console.log('referenceText', referenceText)
                        //console.log('translationText', translationText)
                        //console.log('maxDistance', maxDistance, 'levDistance', levDistance, 'threshold', threshold)

                        if(translationText && levDistance < threshold){
                            missingTranslations.push({
                                    referenceCard,
                                    translationCard,
                                    property: prop
                            })
                        }
                    }
                }
            }
        }
    }

    return missingTranslations
}






/**
 * 
 * @param {string} arkhamDataRootDir 
 * @returns 
 */
export function getLanguageList(arkhamDataRootDir){
    const translationsDirectory = join(arkhamDataRootDir, translationDir)
    return readdir(translationsDirectory)
}


/**
 * 
 * 
 * @param {string} arkhamDataRootDir 
 * @param {string} pack 
 * @param {string} file 
 * @param {string} language 
 * @param {LanguageModule} languageModule 
 * @returns 
 */
export function getUntranslatedCardsList(arkhamDataRootDir, pack, file, language, languageModule){
    const referenceFilepath = join(arkhamDataRootDir, packsDir, pack, file)

    const translationPackDirectory = join(arkhamDataRootDir, translationDir, language, packsDir, pack)
    const translationFilepath = join(translationPackDirectory, file)

    return Promise.all([
        readFile(referenceFilepath, 'utf-8'),
        readFile(translationFilepath, 'utf-8')
    ]).then(([referenceString, translationString]) => {
        /** @type {Card[]} */
        const referenceCards = JSON.parse(referenceString)
        /** @type {Card[]} */
        const translationCards = JSON.parse(translationString)
        
        /** @type {ReturnType<findMissingTranslations>} */
        let missingTranslations = [];
        for(const referenceCard of referenceCards){
            const referenceCardHasTranslatedProperties = translatableProperties.some(prop => typeof referenceCard[prop] === 'string')

            if(referenceCardHasTranslatedProperties){
                // for+find is O(n³) and maybe that's ok for the number of cards
                const translationCard = translationCards.find(({code: code2}) => referenceCard.code === code2)

                if(!translationCard){
                    console.error(`❌ Missing translated card for ${referenceFilepath} code ${referenceCard.code}`)
                }
                else{
                    const missingTranslationsForThisCard = findMissingTranslations(translationCard, referenceCard, languageModule)

                    if(missingTranslationsForThisCard.length >= 1){
                        missingTranslations = [
                            ...missingTranslations, 
                            ...missingTranslationsForThisCard
                        ]
                    }
                }
            }
        }

        return missingTranslations
    })

}

/**
 * 
 * 
 * @param {string} arkhamDataRootDir 
 * @param {string} pack 
 * @param {string} file 
 * @param {string} cardCode 
 * @param {string} language 
 * @param {LanguageModule} languageModule
 * @returns 
 */
export function getCardMissingTranslationsList(arkhamDataRootDir, pack, file, cardCode, language, languageModule){
    const referenceFilepath = join(arkhamDataRootDir, packsDir, pack, file)
    const translationFilepath = join(arkhamDataRootDir, translationDir, language, packsDir, pack, file)

    return Promise.all([
        readFile(referenceFilepath, 'utf-8'),
        readFile(translationFilepath, 'utf-8')
    ]).then(([referenceString, translationString]) => {
        /** @type {Card[]} */
        const referenceCards = JSON.parse(referenceString)
        /** @type {Card[]} */
        const translationCards = JSON.parse(translationString)

        const referenceCard = referenceCards.find(({code}) => code === cardCode)
        const translationCard = translationCards.find(({code}) => code === cardCode)

        if(!referenceCard){
            throw new Error(`❌ Missing card for code ${cardCode} in file ${referenceFilepath}`)
        }
        if(!translationCard){
            throw new Error(`❌ Missing translation card for code ${cardCode} in translation file ${translationFilepath}`)
        }

        return findMissingTranslations(translationCard, referenceCard, languageModule)
    })  
}


/**
 * 
 * @param {string} language 
 * @returns {Promise<LanguageModule>}
 */
export async function importLanguageModule(language){
    /** @type {LanguageModule} */
    let languageModule
    const languageModulePath = join(import.meta.dirname, 'languages', `${language}.js`)

    try{
        languageModule = await import(languageModulePath)
    }
    catch(e){
        // @ts-ignore
        if(e.code === 'ERR_MODULE_NOT_FOUND'){
            // @ts-ignore
            console.error(`❌ Missing language module`, languageModulePath, '\n\n')
        }
        else{
            console.error(`❌ Problem trying to import language module`, languageModulePath, e, '\n\n')
        }

        languageModule = await import(join(import.meta.dirname, 'languages', `model.js`))
    }

    return languageModule
}
