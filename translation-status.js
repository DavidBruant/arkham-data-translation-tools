//@ts-check

/** @import {Card} from './shared.js' */

import {join} from 'node:path'
import {readFile, readdir, stat} from 'node:fs/promises'
import { parseArgs } from 'node:util';

import { select } from '@inquirer/prompts';
import {sum} from 'd3-array'

import { findMissingTranslations, getLanguageList, getReferencePackList, translatableProperties, translationDir } from './shared.js'


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
    }
})

let { values : {language} } = parseArgs({ options });


if(!language){
    const languageOptions = await getLanguageList(arkhamDataRoot)
    console.log('Pick a language for which you want the translation status')

    language = await select({
        message: 'Choose a language for which you want the translation status',
        choices: languageOptions.sort().map(l => ({name: l, value: l}))
    });

}


console.log('language', language);


process.exit()




const packsDir = 'pack'

const languageDir = 'fr';

const referencePacksDirectory = join(arkhamDataRoot, packsDir)

const referencePackDirs = await getReferencePackList(arkhamDataRoot)

for(const packDir of referencePackDirs){
    console.info('Translation status for pack', packDir, 'language', languageDir)
    const referencePackDirectory = join(referencePacksDirectory, packDir)
    const referencePackFilenames = await readdir(referencePackDirectory)

    const translationPackDirectory = join(arkhamDataRoot, translationDir, languageDir, packsDir, packDir)

    for(const packFilename of referencePackFilenames){
        //console.info(`\nChecking missing translations for ${packsDir}/${packDir}/${packFilename}`)
        const referenceFilepath = join(referencePackDirectory, packFilename)
        const translationFilepath = join(translationPackDirectory, packFilename)

        const referenceFileString = await readFile(referenceFilepath, 'utf-8')
        let translationFileString;

        try{
            translationFileString = await readFile(translationFilepath, 'utf-8')
        }
        catch(e){
            // @ts-ignore
            if(e.code === 'ENOENT'){
                console.error(`❌ ${translationFilepath} does not exists while ${referenceFilepath} does`)
            }
            else{
                console.error(`❌ Error trying to read ${translationFilepath} file`, e)
            }
        }

        if(translationFileString){
            /** @type {Card[]} */
            const referenceData = JSON.parse(referenceFileString)
            /** @type {Card[]} */
            const translationData = JSON.parse(translationFileString)

            /** @type {ReturnType<findMissingTranslations>} */
            let missingTranslations = [];
            for(const referenceCard of referenceData){
                const referenceCardHasTranslatedProperties = translatableProperties.some(prop => typeof referenceCard[prop] === 'string')

                if(referenceCardHasTranslatedProperties){
                    // for+find is O(n³) and maybe that's ok for the number of cards
                    const translationCard = translationData.find(({code: code2}) => referenceCard.code === code2)

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

            console.info(`Translation status for ${packDir}/${packFilename} (${referenceData.length} cards)`)

            const numberOfTranlatableTexts = sum(referenceData.map(card => {
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



        }

        
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


        

    }
}








