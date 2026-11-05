//@ts-check

import {writeFile} from 'node:fs/promises'

import richtypo from 'richtypo';
import {dashes, ellipses, punctuationMarks, quotes} from 'richtypo/rules/fr';

import {getReferenceAndTranslationCards} from '../shared.js'


/** @type {(keyof Card)[]} */
const typoFixableProps = ['name', 'back_name', 'text', 'back_text', 'flavor', 'back_flavor']

const nbsp = '\u00a0';
const thinspace = '\u2009'; // Thin space
const nbthinspace = '\u202f'; // Thin no-break space

/* Ignore some cards for automatic punctuation */
/** @type {Set<Card['code']>} */
const exceptions = new Set([
    // https://github.com/sapegin/richtypo.js/discussions/68
    //"01105"
])

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
    // arkham horror specific
    replaceFreeWithFast,
    addNBSpacePerInvestigator,
]


/**
 * 
 * @param {string} arkhamDataRoot 
 * @param {string} pack 
 * @param {string} file 
 * @param {string} language 
 */
export default async function uniformizeFilePunctuation(arkhamDataRoot, pack, file, language){

    const {translationCards, translationFilepath} = await getReferenceAndTranslationCards(arkhamDataRoot, pack, file, language);

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
}
