//@ts-check

/** @import { Card, translatableProperties } from './shared.js' */

/**
 * 
 * @param {string} traits
 */
function suggestFrenchTraitsTranslation(traits){
    console.warn(`No good trait translation for now. It'll come soon.`)
    return traits

}


const staticReplacements = new Map([
    ['<b>Forced</b>', '<b>Forcé</b>']
])

const replacementFunctions = [
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const patternToLookFor = 'When <name> is revealed'.replace('<name>', referenceCard.name)
        const toReplaceWith = `Quand ${translationCard.name} est révélé`;

        return suggestedText.replaceAll(patternToLookFor, toReplaceWith)
    }
]



/**
 * 
 * @param {Card} referenceCard 
 * @param {Card} translationCard 
 * @param {translatableProperties[number]} property
 */
function suggestFrenchTextTranslation(referenceCard, translationCard, property){
    const referenceText = referenceCard[property]

    if(!referenceText){
        throw new TypeError(`Missing referenceText for card ${referenceCard.code}, property '${property}'`)
    }

    let suggestedText = referenceText
    for(const [englishPattern, frenchReplacement] of staticReplacements){
        suggestedText = suggestedText.replaceAll(englishPattern, frenchReplacement)
    }

    for(const replacementFunction of replacementFunctions){
        suggestedText = replacementFunction(suggestedText, referenceCard, translationCard)
    }


    return suggestedText
}

/**
 * 
 * @param {Card} referenceCard 
 * @param {Card} translationCard 
 * @param {translatableProperties[number]} property 
 */
export function suggestFrenchTranslation(referenceCard, translationCard, property){
    if(property === 'name' || property === 'back_name' || property === 'flavor' || property === 'back_flavor'){
        return undefined
    }

    if(property === 'traits' && referenceCard[property]){
        return suggestFrenchTraitsTranslation(referenceCard[property])
    }

    if(property === 'text' || property === 'back_text'){
        return suggestFrenchTextTranslation(referenceCard, translationCard, property)
    }
}