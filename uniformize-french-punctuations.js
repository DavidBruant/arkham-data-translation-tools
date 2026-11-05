#!/usr/bin/env node

//@ts-check

import { styleText, parseArgs } from 'node:util'
import {join} from 'node:path'
import {stat} from 'node:fs/promises'


import { 
    getLanguageList, getPackFileList, getReferencePackList, 
    packsDir, translationDir
} from './shared.js'
import uniformizeFilePunctuation from './library/uniformiseFilePunctuation.js'


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


if(file){
    await uniformizeFilePunctuation(arkhamDataRoot, pack, file, language)
}
else{
    console.info(`Choose a file with '--file <file>'`)
    
    const packFiles = await getPackFileList(arkhamDataRoot, pack)
    console.info('Choices: ', packFiles.join(' | '))

    process.exit()
}






