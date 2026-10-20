#!/usr/bin/env node

//@ts-check

import { styleText, parseArgs } from 'node:util'
import {join} from 'node:path'
import {stat} from 'node:fs/promises'


import { 
    getCardMissingTranslationsList, getLanguageList, getPackFileList, getReferencePackList, getUntranslatedCardsList, 
    packsDir, translationDir,
    importLanguageModule
} from './shared.js'
import { suggestTranslation } from './languages/fr.js'


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
    pack: {
        type: 'string'
    },
    file: {
        type: 'string',
        short: 'f'
    },
    card: {
        type: 'string',
        short: 'c'
    },
    property: {
        type: 'string',
        short: 'p'
    },
})

/** @type { {values: {language?: string, pack?: string, file?: string, card? : string, property?: TranslatableProperty}} } */
// @ts-ignore
const { values : {language, pack, file, card, property} } = parseArgs({ options });


if(!language){
    console.info(`Choose a language with '--language <language>'`)
    
    const languageDirs = await getLanguageList(arkhamDataRoot)
    console.info('Choices: ', languageDirs.join(' | '))

    process.exit()
}

const languageModule = await importLanguageModule(language)


if(!pack){
    console.info(`Choose a pack with '--pack <pack>'`)
    
    const referencePackDirs = await getReferencePackList(arkhamDataRoot)
    console.info('Choices: ', referencePackDirs.join(' | '))

    process.exit()
}

// Verifying the corresponding translation directory exists
const translationPackDirectory = join(arkhamDataRoot, translationDir, language, packsDir, pack)

try{
    let _translationDirStat = await stat(translationPackDirectory)
}
catch(e){
    // @ts-ignore
    if(e.code === 'ENOENT'){
        console.error(`❌ Translation directory ${translationPackDirectory} does not exist for pack ${pack}`)
    }
    else{
        console.error(`❌ Error trying to read ${translationPackDirectory}`, e)
    }
    process.exit(1)
}


if(!file){
    console.info(`Choose a file with '--file <file>'`)
    
    const packFiles = await getPackFileList(arkhamDataRoot, pack)
    console.info('Choices: ', packFiles.join(' | '))

    process.exit()
}

// Verifying the corresponding translation file exists
const translationFile = join(arkhamDataRoot, translationDir, language, packsDir, pack, file)

try{
    let _translationDirStat = await stat(translationFile)
}
catch(e){
    // @ts-ignore
    if(e.code === 'ENOENT'){
        console.error(`❌ Translation file ${translationFile} does not exist`)
    }
    else{
        console.error(`❌ Error trying to read ${translationFile}`, e)
    }
    process.exit(1)
}


if(!card){    
    const missingTranslations = await getUntranslatedCardsList(arkhamDataRoot, pack, file, language, languageModule)

    if(missingTranslations.length === 0){
        console.info('✅ Every card in this pack is already translated')
    }
    else{
        const missingTranslationCodes = new Set(missingTranslations.map(({referenceCard}) => referenceCard.code))

        console.info('Choices: ', [...missingTranslationCodes].join(' | '))
        console.info(`Choose an untranslated card with '--card <card>'`)    
    }

    process.exit()
}


const missingTranslations = await getCardMissingTranslationsList(arkhamDataRoot, pack, file, card, language, languageModule)

if(!property){
    const missingTranslationProperties = missingTranslations.map(({property}) => property);

    if(missingTranslationProperties.length === 0){
        console.info('Everything is already translated')
    }
    else{
        console.info(`Choose a property to translate with '--property <property>'`)
        console.info('Choices: ', [...missingTranslationProperties].join(' | '))
    }

    process.exit()
}

const missingTranslation = missingTranslations.find(({property: prop}) => property === prop)

if(!missingTranslation){
    throw new TypeError(`No missing translation for card ${card}, property '${property}'`)
}

console.info('Transation of card', language, pack, file, card, property)

console.info(styleText(['bold', 'green'], 'Original text:\n'), missingTranslation.referenceCard[property])
console.info(styleText(['bold', 'green'], 'Translated text:\n'), missingTranslation.translationCard[property])

const suggestedTranslation = suggestTranslation(missingTranslation?.referenceCard, missingTranslation?.translationCard, property)

if(suggestedTranslation){
    console.info(styleText(['bold', 'blue'], 'Suggested translation:\n'), JSON.stringify(suggestedTranslation))
}
