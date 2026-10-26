//@ts-check

/** @import {} from '../types.js' */

import { suggestTraitsTranslation } from './shared.js'

// traits that are exactly the same in language as in English
export const sameTranslationTraits = new Set([
    'Arkham',
])

// trait translation from English to target language
export const traitTranslation = new Map([
    
])

// name that are exactly the same in language as in English
export const sameTranslationNames = new Set([
    'La Bella Luna',
])

// flavor texts that are exactly the same in language as in English
export const sameTranslationFlavor = new Set([
    'Negotium perambulans in tenebris...',
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


const staticReplacements = new Map([

])





/**
 * 
 * @param {Card} referenceCard 
 * @param {Card} translationCard 
 * @param {TranslatableProperty} property
 * @param {Map<string, string>} [nameTranslations] translation of cards names in case referenceCard references other cards
 */
function suggestTextTranslation(referenceCard, translationCard, property, nameTranslations = new Map()){
    const referenceText = referenceCard[property]

    if(!referenceText){
        throw new TypeError(`Missing referenceText for card ${referenceCard.code}, property '${property}'`)
    }

    let suggestedText = referenceText
    
    for(const [referenceName, translatedName] of nameTranslations){
        suggestedText = suggestedText.replaceAll(referenceName, translatedName)
    }
    
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
 * @param {Map<string, string>} [nameTranslations] translation of cards names in case referenceCard references other cards
 */
export function suggestTranslation(referenceCard, translationCard, property, nameTranslations){
    if(property === 'name' || property === 'back_name' || property === 'flavor' || property === 'back_flavor'){
        return undefined
    }

    if(property === 'traits' && referenceCard[property]){
        return suggestTraitsTranslation(referenceCard[property], traitTranslation)
    }

    if(property === 'text' || property === 'back_text'){
        return suggestTextTranslation(referenceCard, translationCard, property, nameTranslations)
    }
}