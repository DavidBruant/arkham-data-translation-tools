//@ts-check

/** @import {} from './types.ts' */

import {join} from 'node:path'
import {readFile, readdir} from 'node:fs/promises'

// directory conventions of https://github.com/Kamalisk/arkhamdb-json-data
export const packsDir = 'pack'
export const translationDir = 'translations'




/** @type {TranslatableProperty[]} */
export const translatableProperties = ['name', 'traits', 'text', 'flavor', 'back_name', 'back_flavor', 'back_text'];


// traits that are exactly the same in French as in English
const similarFrenchTranslationTraits = new Set([
    undefined,
    // core
    'Miskatonic.',
    'Miskatonic. Central.',
    'Mutation.',
    'Arkham.',
    'Arkham. Central.',
    'Talent.',
    'Talent. Science.',
    'Obstacle.', 
    
    // dwl
    'Dunwich. Central.',
    'Dunwich.',
    'Reporter.',
    'Train.',

    // ptc
    'Paris.',
    'Assistant.'
])

// name that are exactly the same in French as in English
const similarFrenchTranslationNames = new Set([
    undefined,
    // core
    'Barricade',
    'Endurance', 
    'M1911',
    'Prestidigitation',
    'French Hill',
    'Acolyte',

    // dwl
    'La Bella Luna',
    //'Peter Clover',
    'Thrall',
    'Adaptable',
    'Springfield M1903',
    
    // ptc
    'Recharge',
    'St. Barnabé', 
    'Montparnasse', 
    'Montmartre',
    'Opéra Garnier', 
    "Gare d'Orsay",
    'Canal Saint-Martin', 
    'Le Marais',
    'Notre-Dame', 
    'Suggestion',
    "Porte de l'Avancée", 
    'Chœur Gothique',
    'Lupara',
    'Fin', 
    'Possession',
    'Sophie',
    'Improvisation',
    'Poltergeist',
    'Corrosion',
    'Mano a Mano'

])

// flavor texts that are exactly the same in French as in English
const similarFrenchTranslationFlavor = new Set([
    undefined,
    'Negotium perambulans in tenebris...'
])



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
 * This is meant to be an approximation
 * 
 * @param {Card} translationCard 
 * @param {Card} referenceCard
 * @returns {MissingTranslation[]}
 */
export function findMissingTranslations(translationCard, referenceCard){

    /** @type {ReturnType<findMissingTranslations>} */
    const missingTranslations = []

    for(const prop of translatableProperties){
        const referenceText = referenceCard[prop];
        const translationText = translationCard[prop];

        if(prop === 'traits'){
            if(!similarFrenchTranslationTraits.has(translationText) && translationText === referenceText && referenceText && referenceText.length >= 1){
                missingTranslations.push({
                    referenceCard,
                    translationCard,
                    property: prop
                })
            }
        }
        else{
            if(prop === 'name' || prop === 'back_name'){
                if(
                    referenceCard.type_code === 'investigator' || 
                    (referenceCard.type_code === 'asset' && (referenceCard.traits?.includes('Ally.') || referenceCard.traits?.includes('Humanoid.') || referenceCard.traits?.includes('Bystander.')) && referenceCard.is_unique) || 
                    (referenceCard.type_code === 'enemy' && referenceCard.is_unique)
                ){
                    // names of unique people/enemies aren't translated
                }
                else{
                    if(translationText === referenceText && !similarFrenchTranslationNames.has(translationText)){
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
                    if(translationText === referenceText && !similarFrenchTranslationFlavor.has(translationText)){
                        missingTranslations.push({
                            referenceCard,
                            translationCard,
                            property: prop
                        })
                    }
                }
                else{
                    // base case, if texts are different, they're a translation
                    if(referenceText && translationText && translationText === referenceText){
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
 * @returns 
 */
export function getUntranslatedCardsList(arkhamDataRootDir, pack, file, language){
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
                    const missingTranslationsForThisCard = findMissingTranslations(translationCard, referenceCard)

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
 * @returns 
 */
export function getCardMissingTranslationsList(arkhamDataRootDir, pack, file, cardCode, language){
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

        return findMissingTranslations(translationCard, referenceCard)
    })  
}