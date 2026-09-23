#!/usr/bin/env node

//@ts-check

import {join} from 'node:path'
import {stat} from 'node:fs/promises'

import minimist from 'minimist'

import { 
    getCardMissingTranslationsList, getLanguageList, getPackFileList, getReferencePackList, getUntranslatedCardsList, 
    packsDir, translationDir, translatableProperties
} from './shared.js'
import { suggestFrenchTranslation } from './suggestFrenchTranslation.js'


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


const argv = minimist(process.argv.slice(2));

const { 
    language, 
    pack, 
    file, 
} = argv

/** @type {translatableProperties[number] | undefined} */
const property = argv.property;

// card may be parsed as a number. It'll be correct later
let {card} = argv

if(!language){
    console.log(`Choose a language with '--language <language>'`)
    
    const languageDirs = await getLanguageList(arkhamDataRoot)
    console.log('Choices: ', languageDirs.join(' | '))

    process.exit()
}

if(!pack){
    console.log(`Choose a pack with '--pack <pack>'`)
    
    const referencePackDirs = await getReferencePackList(arkhamDataRoot)
    console.log('Choices: ', referencePackDirs.join(' | '))

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
    console.log(`Choose a file with '--file <file>'`)
    
    const packFiles = await getPackFileList(arkhamDataRoot, pack)
    console.log('Choices: ', packFiles.join(' | '))

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
    console.log(`Choose an untranslated card with '--card <card>'`)
    
    const missingTranslations = await getUntranslatedCardsList(arkhamDataRoot, pack, file, language)

    const missingTranslationCodes = new Set(missingTranslations.map(({referenceCard}) => referenceCard.code))

    console.log('Choices: ', [...missingTranslationCodes].join(' | '))

    process.exit()
}

// fix card if it was parsed as a number
if(typeof card === 'number'){
    const str = card.toString(10)
    if(str.length >= 5){
        card = str
    }
    else{
        card = str.padStart(5, '0')
    }
}


const missingTranslations = await getCardMissingTranslationsList(arkhamDataRoot, pack, file, card, language)

if(!property){
    console.log(`Choose a property to translate with '--property <property>'`)
    
    const missingTranslationProperties = missingTranslations.map(({property}) => property);

    console.log('Choices: ', [...missingTranslationProperties].join(' | '))

    process.exit()
}

console.info('Transation of card', language, pack, file, card, property)
const missingTranslation = missingTranslations.find(({property: prop}) => property === prop)

if(!missingTranslation){
    throw new TypeError(`No missing translation for card ${card}, property '${property}'`)
}

console.log('Original text:', missingTranslation.referenceCard[property])
console.log('Translated text:', missingTranslation.translationCard[property])

const suggestedTranslation = suggestFrenchTranslation(missingTranslation?.referenceCard, missingTranslation?.translationCard, property)

if(suggestedTranslation){
    console.log('Suggested translation:', JSON.stringify(suggestedTranslation))
}