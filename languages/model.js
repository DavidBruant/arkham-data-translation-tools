//@ts-check

/** @import {} from '../types.js' */

import { suggestTraitsTranslation } from './shared.js'

// traits that are exactly the same in language as in English
export const sameTranslationTraits = new Set([
    'Arkham',
])

const traitTranslation = new Map([
    
])

// name that are exactly the same in language as in English
export const sameTranslationNames = new Set([
    'La Bella Luna',
])

// flavor texts that are exactly the same in language as in English
export const sameTranslationFlavor = new Set([
    'Negotium perambulans in tenebris...',
])


const staticReplacements = new Map([

])

const replacementFunctions = [
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(Put (.*) into play)/i
        const matches = suggestedText.match(regExp)

        if(matches){
            return suggestedText.replace(matches[1], `mettez en jeu ${matches[2]}`)
        }
        else{
            return suggestedText
        }
    },
]



/**
 * 
 * @param {Card} referenceCard 
 * @param {Card} translationCard 
 * @param {TranslatableProperty} property
 */
function suggestTextTranslation(referenceCard, translationCard, property){
    const referenceText = referenceCard[property]

    if(!referenceText){
        throw new TypeError(`Missing referenceText for card ${referenceCard.code}, property '${property}'`)
    }

    let suggestedText = referenceText
    for(const replacementFunction of replacementFunctions){
        suggestedText = replacementFunction(suggestedText, referenceCard, translationCard)
    }

    for(const [englishPattern, frenchReplacement] of staticReplacements){
        suggestedText = suggestedText.replaceAll(englishPattern, frenchReplacement)
    }

    return suggestedText
}


/**
 * 
 * @param {Card} referenceCard 
 * @param {Card} translationCard 
 * @param {TranslatableProperty} property 
 */
export function suggestTranslation(referenceCard, translationCard, property){
    if(property === 'name' || property === 'back_name' || property === 'flavor' || property === 'back_flavor'){
        return undefined
    }

    if(property === 'traits' && referenceCard[property]){
        return suggestTraitsTranslation(referenceCard[property], traitTranslation)
    }

    if(property === 'text' || property === 'back_text'){
        return suggestTextTranslation(referenceCard, translationCard, property)
    }
}