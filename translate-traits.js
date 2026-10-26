#!/usr/bin/env node

//@ts-check

import { styleText, parseArgs } from 'node:util'
import {join} from 'node:path'
import {stat, writeFile} from 'node:fs/promises'

import { 
    getLanguageList, getPackFileList, getReferencePackList, getUntranslatedCardsList, 
    packsDir, translationDir,
    importLanguageModule,
    getReferenceAndTranslationCards
} from './shared.js'
import { parseTraits, suggestTraitsTranslation } from './languages/shared.js'


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
    }
})

/** @type { {values: {language?: string, pack?: string, file?: string}} } */
const { values : {language, pack, file} } = parseArgs({ options });


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


const {referenceCards, translationCards, translationFilepath} = await getReferenceAndTranslationCards(arkhamDataRoot, pack, file, language);

const {sameTranslationTraits, traitTranslation} = languageModule

const untranslatedTraits = new Set()

// in each card of the translation file, get the traits of the reference file, 
for(const card of referenceCards){
    const {code, traits: traitsString} = card;

    if(traitsString){
        const traits = parseTraits(traitsString)

        for(const trait of traits){
            if(!sameTranslationTraits.has(trait) && !traitTranslation.has(trait)){
                untranslatedTraits.add(trait)
            }
        }

        const translatedTraits = suggestTraitsTranslation(traitsString, traitTranslation)

        const card = translationCards.find(c => c.code === code)
        if(!card){
            throw new TypeError(`Missing translated card ${code}`)
        }

        card.traits = translatedTraits
    }

}


if(untranslatedTraits.size >= 1){
    console.info('Untranslated traits:', [...untranslatedTraits].join(' | '))
    console.info('Translation map entries:')
    console.info([...untranslatedTraits].map(t => `[\`${t}\`, \`\`],`).join('\n'))
    process.exit()
}
else{
    await writeFile(translationFilepath, JSON.stringify(translationCards, null, 4))
    console.info('Traits translated!')
}

