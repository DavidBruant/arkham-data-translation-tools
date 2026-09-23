//@ts-check

/** @import { translatableProperties } from './shared.js' */

import {traitFrenchTranslation} from './shared.js'



/**
 * 
 * @param {string} trait
 */
function translateTrait(trait){
    return traitFrenchTranslation.get(trait) || trait
}


/**
 * 
 * @param {string} traits
 */
function suggestFrenchTraitsTranslation(traits){
    console.warn(`No good trait translation for now. It'll come soon.`)
    return traits

}


const staticReplacements = new Map([
    // generic words
    [' and ', ' et '],
    ['You must either', 'vous devez soit'],
    ['above', 'au-dessus'],
    ['below', 'en-dessous'],
    ['to the right', 'à droite'],
    ['to the left', 'à gauche'],
    ['adjacent to', 'adjacent à'],
    ['attached', 'attaché'],

    // rules words
    ['Discard', 'Défaussez'],
    ['discard', 'défaussez'],
    ['Then,', 'Ensuite,'],
    ['copy', 'exemplaire'],
    ['in play', 'en jeu'],
    ['hand slot', 'emplacement de main'],
    ['it gains surge', `elle gagne Renfort`],
    ['shroud', 'valeur occulte'],

    // Arkham LCG concepts
    ['enemy', 'ennemi'],
    ['clues', 'indices'],
    ['<b>Forced</b>', '<b>Forcé</b>'],
    ['<b>Spawn</b>', '<b>Génération</b>'],
    ['<b>Revelation</b>', '<b>Révélation</b>'],
    ['spawn', 'générez'],
    ['<b>Parley.</b>', '<b>Discussion</b>'],
    ['Hunter.', 'Chasseur.'],
    ['Retaliate.', 'Riposte.'],
    ['in your threat area', 'dans votre zone de menace'],

    // location
    ['unrevealed locations', 'lieux non-révélés'],
    ['unrevealed location', 'lieu non-révélé'],
    ['at any location', `dans n'importe quel lieu`],
    ['at that location', `dans ce lieu`],
    ['look at the revealed side', 'regardez la face révélée'],
    ['Attach to your location', 'Attachez cette carte à votre lieu'],
    ['Attached location gets', 'Le lieu attaché gagne'],
    
    // moving
    ['cancel the effects of the move', 'annulez ce déplacement'],

    // costs
    ['As an additional cost for you to', 'En tant que coût supplémentaire pour que vous puissiez'],
    ['must spend', 'doivent dépenser'],
    ['investigators at your location', 'les investigateurs dans votre lieu'],
    
    // timing
    ['When you would move', 'Quand vous devriez vous déplacer'],
    ['After you end your turn at', 'Après avoir terminé votre tour dans'],
    ['At the end of your turn', 'À la fin de votre tour'],
    ['At the end of the round', 'À la fin du round'],

    // Loosing things
    ['take 1 direct horror', 'subissez 1 horreur directe'],
    ['take 1 direct damage', 'subissez 1 dégât direct'],
    ['discard 2 random cards from your hand', 'défaussez 2 cartes prises au hasard dans votre main'],
    ['lose 5 resources', 'perdre 5 ressources'],

    // Skill tests
    ['If you succeed', 'En cas de réussite'],
    ['If you fail', `En cas d'échec`],
    ['For each point you fail by', 'Pour chaque point manquant'],

    // limits/max
    ['Group limit once per game.', `Limite collective d'une fois par partie.`],
    ['Limit 1 per investigator.', `Limite de 1 par investigateur.`],

    // random
    ['While you are investigating', 'Tant que vous enquêtez'],
    ['Catacombs deck', 'deck Catacombes'],
    ['Ignore the text', 'Ignorez le texte'],
    ['the skill indicated by the investigation attempt', `la compétence indiquée lors de la tentative d'enquête`],
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
        const pattern = 'When you reveal <name>'
        
        const patternToLookForWithName = pattern.replace('<name>', referenceCard.name)
        const toReplaceWithName = `Quand vous révélez ${translationCard.name}`;
        
        const patternToLookForWithBackName = pattern.replace('<name>', referenceCard.back_name)
        const toReplaceWithBackName = `Quand vous révélez ${translationCard.back_name}`;

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
        const regexp = /(Takes? (\d) damage)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `subissez ${matches[2]} dégât${matches[2] !== '1' ? 's' : ''}`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(Takes? (\d) horror)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `subissez ${matches[2]} horreur${matches[2] !== '1' ? 's' : ''}`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const mustSpendAsAGroupRegExp = /(Test (\[.*\] \(.*\)))/
        const matches = suggestedText.match(mustSpendAsAGroupRegExp)

        if(matches){
            return suggestedText.replace(matches[1], `effectuez un test de ${matches[2]}`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const mustSpendAsAGroupRegExp = /(\[\[(\w+)\]\])/g
        const matches = suggestedText.matchAll(mustSpendAsAGroupRegExp)

        for(const match of matches){
            suggestedText = suggestedText.replace(match[1], `[[${translateTrait(match[2])}]]`)
        }

        return suggestedText
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
        //console.log('suggestedText', suggestedText)
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