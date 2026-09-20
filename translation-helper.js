//@ts-check

import {join} from 'node:path'
import {readFile, readdir, stat} from 'node:fs/promises'

import minimist from 'minimist'

import { 
    getCardMissingTranslationsList, getLanguageList, getPackFileList, getReferencePackList, getUntranslatedCardsList, 
    packsDir, translationDir, translatableProperties
} from './shared.js'
import { suggestFrenchTranslation } from './suggestFrenchTranslation.js'


const ARKHAM_DATA_ROOT = process.env.ARKHAM_DATA_ROOT

if(!ARKHAM_DATA_ROOT){
    console.error(`Arkham data could not be found.\nMissing environment variable ARKHAM_DATA_ROOT.\nConfigure it and try again`)
    process.exit(1)
}

try{
    const rootStat = await stat(ARKHAM_DATA_ROOT)

    if(!rootStat.isDirectory()){
        console.error(`${ARKHAM_DATA_ROOT} is not a directory`)
        process.exit(1)
    }

}
catch(e){
    // @ts-ignore
    if(e.code === 'ENOENT'){
        console.error(`${ARKHAM_DATA_ROOT} from environement variable ARKHAM_DATA_ROOT does not exist`)
    }
    else{
        console.error(`Error trying to reach directory ${ARKHAM_DATA_ROOT} from ARKHAM_DATA_ROOT environement variable (cwd: ${process.cwd()})`, e)
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
    
    const languageDirs = await getLanguageList(ARKHAM_DATA_ROOT)
    console.log('Choices: ', languageDirs.join(' | '))

    process.exit()
}

if(!pack){
    console.log(`Choose a pack with '--pack <pack>'`)
    
    const referencePackDirs = await getReferencePackList(ARKHAM_DATA_ROOT)
    console.log('Choices: ', referencePackDirs.join(' | '))

    process.exit()
}

// Verifying the corresponding translation directory exists
const translationPackDirectory = join(ARKHAM_DATA_ROOT, translationDir, language, packsDir, pack)

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
    
    const packFiles = await getPackFileList(ARKHAM_DATA_ROOT, pack)
    console.log('Choices: ', packFiles.join(' | '))

    process.exit()
}

// Verifying the corresponding translation file exists
const translationFile = join(ARKHAM_DATA_ROOT, translationDir, language, packsDir, pack, file)

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
    
    const missingTranslations = await getUntranslatedCardsList(ARKHAM_DATA_ROOT, pack, file, language)

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


const missingTranslations = await getCardMissingTranslationsList(ARKHAM_DATA_ROOT, pack, file, card, language)

if(!property){
    console.log(`Choose a property to translate with '--property <property>'`)
    
    const missingTranslationProperties = missingTranslations.map(({property}) => property);

    console.log('Choices: ', [...missingTranslationProperties].join(' | '))

    process.exit()
}

console.info('Transation of card', language, pack, file, card, property)
const missingTranslation = missingTranslations.find(({property: prop}) => property === prop)

if(!missingTranslation){
    throw new TypeError(`No missing translation for card ${card.code}, property '${property}'`)
}

console.log('Original text:', missingTranslation.referenceCard[property])
console.log('Translated text:', missingTranslation.translationCard[property])

const suggestedTranslation = suggestFrenchTranslation(missingTranslation?.referenceCard, missingTranslation?.translationCard, property)

if(suggestedTranslation){
    console.log('Suggested translation:', suggestedTranslation)
}