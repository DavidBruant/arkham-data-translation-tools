#!/usr/bin/env node

//@ts-check

import { styleText, parseArgs } from 'node:util'
import {join} from 'node:path'
import {stat, writeFile} from 'node:fs/promises'

import richtypo from 'richtypo';
import {dashes, ellipses, punctuationMarks, quotes} from 'richtypo/rules/fr';

import { 
    getLanguageList, getPackFileList, getReferencePackList, 
    packsDir, translationDir,
    getReferenceAndTranslationCards
} from './shared.js'


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
    pack: {
        type: 'string'
    },
    file: {
        type: 'string',
        short: 'f'
    }
})

// for now, let's hardcode the French language
const language = 'fr'

/** @type { {values: {pack?: string, file?: string}} } */
const { values : {pack, file} } = parseArgs({ options });


if(!language){
    console.info(`Choose a language with '--language <language>'`)
    
    const languageDirs = await getLanguageList(arkhamDataRoot)
    console.info('Choices: ', languageDirs.join(' | '))

    process.exit()
}


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


const {translationCards, translationFilepath} = await getReferenceAndTranslationCards(arkhamDataRoot, pack, file, language);

/** @type {(keyof Card)[]} */
const typoFixableProps = ['name', 'back_name', 'text', 'back_text', 'flavor', 'back_flavor']

const nbsp = '\u00a0';
const thinspace = '\u2009'; // Thin space
const nbthinspace = '\u202f'; // Thin no-break space

/**
 * replace [free] with [fast] 
 * 
 * @param {string} text 
 * @returns {string}
 */
function replaceFreeWithFast(text){
    return text.replaceAll('[free]', '[fast]')
}

/**
 * add thin non-breaking space before "[per_investigator]"
 * 
 * @param {string} text 
 * @returns {string}
 */
function addNBSpacePerInvestigator(text){
    const regexp = /\s*\[per\_investigator\]/g
    const matches = text.matchAll(regexp)

    for(const match of matches){
        text = text.replace(match[0], `${nbthinspace}[per_investigator]`)
    }

    return text
}

const rules = [
    ...dashes, 
    ellipses,
    quotes,
    punctuationMarks,
    replaceFreeWithFast,
    addNBSpacePerInvestigator
]


/* Ignore some cards for automatic punctuation */
/** @type {Set<Card['code']>} */
const exceptions = new Set([
    // https://github.com/sapegin/richtypo.js/discussions/68
    "01105"
])


for(const card of translationCards){
    if(!exceptions.has(card.code)){
        for(const prop of typoFixableProps){
            const text = card[prop];

            if(typeof text === 'string'){
                // @ts-ignore
                card[prop] = richtypo(rules, text)
            }
        }
    }
}



await writeFile(translationFilepath, JSON.stringify(translationCards, null, 4))

console.info(`✅ Typo uniformized for ${pack}/${file}`)
