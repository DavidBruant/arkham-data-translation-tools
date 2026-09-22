//@ts-check

/** @import {Card, MissingTranslation} from './shared.js' */

import {join} from 'node:path'
import {readFile, readdir, stat} from 'node:fs/promises'
import { parseArgs, styleText } from 'node:util';

import { select } from '@inquirer/prompts';
import {sum} from 'd3-array'

import { findMissingTranslations, getLanguageList, getReferencePackList, packsDir, translatableProperties, translationDir } from './shared.js'


const ARKHAM_DATA_ROOT = process.env.ARKHAM_DATA_ROOT
const arkhamDataRoot = ARKHAM_DATA_ROOT || process.cwd()

try{
    const rootStat = await stat(arkhamDataRoot)

    if(!rootStat.isDirectory()){
        console.error(`${arkhamDataRoot} is not a directory`)
        process.exit(1)
    }

}
catch(e){
    // @ts-ignore
    if(e.code === 'ENOENT'){
        if(process.env.ARKHAM_DATA_ROOT){
            console.error(`${arkhamDataRoot} from environement variable ARKHAM_DATA_ROOT does not exist`)
        }
        else{
            console.error(`Missing ARKHAM_DATA_ROOT environment variable`)
        }
    }
    else{
        console.error(`Error trying to reach directory ${arkhamDataRoot} from ARKHAM_DATA_ROOT environement variable (cwd: ${process.cwd()})`, e)
    }

    process.exit(1)
}


const options = /** @type {const} */ ({
    language: {
        type: 'string',
        short: 'l',
    },
    all: {
        type: 'boolean',
        short: 'a'
    },
    pack: {
        type: 'string',
        short: 'p'
    }
})

let { values : {language, all, pack} } = parseArgs({ options });

if(!language){
    const languageOptions = await getLanguageList(arkhamDataRoot)

    language = await select({
        message: 'Choose a language for which you want the translation status',
        choices: languageOptions.sort().map(l => ({name: l, value: l}))
    });
}

if(all && pack){
    console.error(`You cannot choose both --all and --pack <pack>. You need to pick only one`)
}

if(!all && !pack){
    const packOptions = await getReferencePackList(arkhamDataRoot)

    pack = await select({
        message: 'Choose a pack for which you want the translation status',
        choices: packOptions.sort().map(l => ({name: l, value: l}))
    });
}


const referencePacksDirectory = join(arkhamDataRoot, packsDir)



/**
 * @param {{ referenceCards: Card[] }} fileTranslationStatus
 */
function getNumberOfTranslatableTextsInFile(fileTranslationStatus){
    return sum(fileTranslationStatus.referenceCards.map(card => {
        let translatableItemsCount = 0;
        for(const prop of translatableProperties){
            if(card[prop] && card[prop].length >= 1){
                translatableItemsCount++
            }
        }
        return translatableItemsCount
    }))
}

/**
 * @param {{ missingTranslations: MissingTranslation[] | undefined }} fileTranslationStatus
 */
function getNumberMissingTranslationsInFile(fileTranslationStatus){
    return fileTranslationStatus.missingTranslations?.length || 0
}



if(pack){
    console.info(`📖 Translation status for pack '${pack}' language '${language}'`)

    const packTranslationStatus = await getPackTranslationStatus(language, pack)

    const errors = packTranslationStatus.filter(fileTranslationStatus => !!fileTranslationStatus.error)

    const numberOfTranlatableTexts = sum(packTranslationStatus.map(getNumberOfTranslatableTextsInFile))

    const numberOfMissingTranslations = sum(packTranslationStatus.map(getNumberMissingTranslationsInFile))
    
    const numberOfTranslatedTexts = numberOfTranlatableTexts - numberOfMissingTranslations

    if(errors.length === 0 && numberOfTranslatedTexts === numberOfTranlatableTexts){
        console.log(`✅ Every card in the pack is translated!`);
        console.log(
            styleText('italic', 'Each investigator earns 1 bonus experience, as they reflect, satisfied of the state of translation')
        )
    }
    else{
        if(numberOfTranslatedTexts === 0){
            console.log('🗋 No card in the pack is translated. Take 1 horror.')
        }
        else{
            console.log(`📜 ${numberOfTranslatedTexts}/${numberOfTranlatableTexts} texts translated`)

            packTranslationStatus.sort((fileTranslationStatus1, fileTranslationStatus2) => {
                if(fileTranslationStatus1.error && !fileTranslationStatus2.error){
                    return -1
                }
                
                if(!fileTranslationStatus1.error && fileTranslationStatus2.error){
                    return 1
                }

                if(fileTranslationStatus1.error && fileTranslationStatus2.error){
                    return fileTranslationStatus1.packFilename.localeCompare(fileTranslationStatus2.packFilename)
                }

                return fileTranslationStatus2.missingTranslations.length - fileTranslationStatus1.missingTranslations.length
            })

            for(const fileTranslationStatus of packTranslationStatus){
                const {packFilename} = fileTranslationStatus;

                if(fileTranslationStatus.error){
                    console.log(`❌ Error with ${fileTranslationStatus.packFilename}: ${fileTranslationStatus.error.message}`)
                }
                else{
                    const numberOfTranslatableTexts = getNumberOfTranslatableTextsInFile(fileTranslationStatus)
                    const numberMissingTranslations = getNumberMissingTranslationsInFile(fileTranslationStatus)
                    const numberOfTranslatedTexts =  numberOfTranslatableTexts - numberMissingTranslations

                    if(numberOfTranslatedTexts === numberOfTranslatableTexts){
                        console.log('✅', styleText('bold', packFilename))
                    }
                    else{
                        if(numberOfTranslatedTexts === 0){
                            console.log('🗋 ', styleText('bold', packFilename), 'No card in the file is translated. Take 1 horror.')
                        }
                        else{
                            console.log(`📜 ${styleText('bold', packFilename)} ${numberOfTranslatedTexts}/${numberOfTranslatableTexts} texts translated`)
                        }
                    }
                }
            }
        }
    }
}




/**
 * 
 * @param {string} language 
 * @param {string} pack 
 */
async function getPackTranslationStatus(language, pack){
    
    const referencePackDirectory = join(referencePacksDirectory, pack)
    const referencePackFilenames = await readdir(referencePackDirectory)

    return Promise.all(
        referencePackFilenames.map(packFilename => getFileTranslationStatus(language, pack, packFilename))
    )
}





/**
 * 
 * @param {string} language 
 * @param {string} pack 
 * @param {string} packFilename 
 * @returns { Promise<
 *  {missingTranslations: MissingTranslation[], referenceCards: Card[], translationCards: Card[], packFilename: string}
 *  | {error: Error, referenceCards: Card[], packFilename: string}
 * >}
 */
async function getFileTranslationStatus(language, pack, packFilename){
    const referencePackDirectory = join(referencePacksDirectory, pack)

    const translationPackDirectory = join(arkhamDataRoot, translationDir, language, packsDir, pack)
    const referenceFilepath = join(referencePackDirectory, packFilename)
    const translationFilepath = join(translationPackDirectory, packFilename)

    const referenceFileString = await readFile(referenceFilepath, 'utf-8')
    /** @type {Card[]} */
    const referenceCards = JSON.parse(referenceFileString)
    let translationFileString;

    try{
        translationFileString = await readFile(translationFilepath, 'utf-8')
    }
    catch(e){
        let error;

        // @ts-ignore
        if(e.code === 'ENOENT'){
            error = new Error(`${translationFilepath} does not exists while ${referenceFilepath} does`)
        }
        else{
            error = new Error(`Error trying to read ${translationFilepath} file. ${e}`)
        }
        
        return {
            error,
            referenceCards,
            packFilename
        }
    }

    
    /** @type {Card[]} */
    const translationCards = JSON.parse(translationFileString)

    /** @type {MissingTranslation[]} */
    let missingTranslations = [];

    /** @type {Card['code'][]} */
    const missingTranslationCards = []

    for(const referenceCard of referenceCards){
        const referenceCardHasTranslatedProperties = translatableProperties.some(prop => typeof referenceCard[prop] === 'string')

        if(referenceCardHasTranslatedProperties){
            // for+find is O(n³) and maybe that's ok for a number of cards in the 1000s max
            const translationCard = translationCards.find(({code: code2}) => referenceCard.code === code2)

            if(!translationCard){
                missingTranslationCards.push(referenceCard.code)
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

    if(missingTranslationCards.length >= 1){
        return {
            error: new Error(`Missing translation cards in ${translationFilepath} for cards ${missingTranslationCards.join(', ')} `),
            referenceCards,
            packFilename
        }
    }

    return {
        referenceCards,
        translationCards,
        missingTranslations,
        packFilename
    }
}



if(all){
    const referencePackDirs = await getReferencePackList(arkhamDataRoot)

    console.log('PPP do overall translation status for the given language')
    process.exit()
}



/*
        console.info(`Translation status for ${pack}/${packFilename} (${referenceCards.length} cards)`)

        const numberOfTranlatableTexts = sum(referenceCards.map(card => {
            let translatableItemsCount = 0;
            for(const prop of translatableProperties){
                if(card[prop] && card[prop].trim().length >= 1){
                    translatableItemsCount++
                }
            }
            return translatableItemsCount
        }))

        const numberOfMissingTranslations = missingTranslations.length
        const numberOfTranslatedTexts = numberOfTranlatableTexts - numberOfMissingTranslations

        console.info(
            numberOfTranslatedTexts === numberOfTranlatableTexts ? '✅' :  (numberOfTranslatedTexts === 0 ? '🗋 ' : '🖋️ '),
            `${numberOfTranslatedTexts}/${numberOfTranlatableTexts} texts translated\n`

        )
*/



//for(const packDir of referencePackDirs){
    

        
        /*
        if(missingTranslations.length === 0){
            console.info(`No missing ${languageDir} translations for ${packsDir}/${packDir}/${packFilename}`)
        }
        else{


            for(const {referenceCard, translationCard, property} of missingTranslations){
                console.log('Missing translation', packDir, packFilename, 'card', referenceCard.code, 'property', property)
                console.log('Reference:', referenceCard[property])
                console.log('Translation:',  translationCard[property])
            }
        }
        */


        

    
//}








