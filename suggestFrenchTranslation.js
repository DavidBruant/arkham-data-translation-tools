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
    ['<b>Forced</b>', '<b>Forcé</b>'],
    ['above', 'au-dessus'],
    ['below', 'en-dessous'],
    ['to the right', 'à droite'],
    ['to the left', 'à gauche'],
    ['clues', 'indices'],
    ['unrevealed locations', 'lieux non-révélés'],
    ['As an additional cost for you to', 'En tant que coût supplémentaire pour que vous puissiez'],
    ['must spend', 'doivent dépenser'],
    ['investigators at your location', 'les investigateurs dans votre lieu'],
    ['After you end your turn at', 'Après avoir terminé votre tour dans'],
    ['take 1 direct horror', 'subissez 1 horreur directe'],
    ['discard 2 random cards from your hand', 'défaussez 2 cartes prises au hasard dans votre main'],

    ['If you succeed', 'En cas de réussite'],
    ['(Group limit once per game.)', `(Limite collective d'une fois par partie.)`],

    ['look at the revealed side', 'regardez la face révélée'],
    ['in play', 'en jeu'],
    ['hand slot', 'emplacement de main'],

    ['Catacombs deck', 'deck Catacombes'],
    ['adjacent to', 'adjacent à'],
    ['Ignore the text', 'Ignorez le texte'],
    ['the skill indicated by the investigation attempt', `la compétence indiquée lors de la tentative d'enquête`],
    ['While you are investigating', 'Tant que vous enquêtez']
])

// must spend 1[per_investigator] clues, as a group.

const replacementFunctions = [
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const pattern = 'When <name> is revealed'
        const patternToLookForWithName = pattern.replace('<name>', referenceCard.name)
        const toReplaceWithName = `Quand ${translationCard.name} est révélé`;
        const patternToLookForWithBackName = pattern.replace('<name>', referenceCard.back_name)
        const toReplaceWithBackName = `Quand ${translationCard.back_name} est révélé`;

        return suggestedText
            .replaceAll(patternToLookForWithName, toReplaceWithName)
            .replaceAll(patternToLookForWithBackName, toReplaceWithBackName)
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const putIntoPlayRegExp = /(Put (.*) into play)/
        const matches = suggestedText.match(putIntoPlayRegExp)

        //console.log('matches', matches)

        if(matches){
            return suggestedText.replace(matches[1], `mettez en jeu ${matches[2]}`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const mustSpendAsAGroupRegExp = /(must spend (.*), as a group)/
        const matches = suggestedText.match(mustSpendAsAGroupRegExp)

        //console.log('matches', matches)

        if(matches){
            return suggestedText.replace(matches[1], `doivent dépenser collectivement ${matches[2]}`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const mustSpendAsAGroupRegExp = /(Test (\[.*\] \(.*\)))/
        const matches = suggestedText.match(mustSpendAsAGroupRegExp)

        //console.log('matches', matches)

        if(matches){
            return suggestedText.replace(matches[1], `effectuez un test de ${matches[2]}`)
        }
        else{
            return suggestedText
        }
    },

    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {

        return suggestedText
            .replaceAll(referenceCard.name, translationCard.name)
            .replaceAll(referenceCard.back_name, translationCard.back_name)
    },
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