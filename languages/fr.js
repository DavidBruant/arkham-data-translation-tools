//@ts-check

import { parseTraits } from './shared.js'

/** @import {} from '../types.ts' */


// traits that are exactly the same in French as in English
export const sameTranslationTraits = new Set([
    // core
    'Miskatonic',
    'Central',
    'Arkham',

    'Obstacle', 
    'Mutation',

    'Byakhee',
    'Coterie', 

    'Talent',
    'Science',
    'Police', 
    'Expert',

    
    // investigators
    'Clairvoyant',
    'Profession',

    // dwl
    'Dunwich',
    'Reporter',
    'Train',
    'Abomination',
    'Poison',
    'Shoggoth',
    'Instrument',

    // ptc
    'Paris',
    'Assistant',

    
    // tcu
    'Tarot',

    // side
    'Bayou',
    'Dhole',
    'Gug',


])

const traitTranslation = new Map([
    ['Humanoid', 'Humanoïde'],
    ['Bystander', 'Passant'],
    ['Cultist', 'Cultiste'],
    ['Ally', 'Allié'],
    ['Criminal', 'Criminel'],
    ['Elite', 'Élite'],
])


// name that are exactly the same in French as in English
export const sameTranslationNames = new Set([
    // core
    'Barricade',
    'Endurance', 
    'M1911',
    'Prestidigitation',
    'French Hill',
    'Acolyte',
    'Perception',

    // investigator
    'Arrogance',
    'Mauser C96',
    'Beretta M1918',
    'Clairvoyance',
    'Becky',
    'Déjà Vu',

    // dwl
    'La Bella Luna',
    'Thrall',
    'Adaptable',
    'Springfield M1903',
    
    // ptc
    'Recharge',
    'St. Barnabé', 
    'Montparnasse', 
    'Montmartre',
    'Opéra Garnier', 
    "Gare d'Orsay",
    'Canal Saint-Martin', 
    'Le Marais',
    'Notre-Dame', 
    'Suggestion',
    "Porte de l'Avancée", 
    'Chœur Gothique',
    'Lupara',
    'Fin', 
    'Possession',
    'Sophie',
    'Improvisation',
    'Poltergeist',
    'Corrosion',
    'Mano a Mano',


    // side
    'Garden District',
    'Broadmoor',
    'Faubourg Marigny',

])

// flavor texts that are exactly the same in French as in English
export const sameTranslationFlavor = new Set([
    'Negotium perambulans in tenebris...',
    'Ding, ding, ding!',
])




const staticReplacements = new Map([

    [
        `Shuffle the encounter discard pile into the encounter deck.`, 
        `mélangez la pile de défausse Rencontre dans le deck Rencontre.`
    ],
    
    // moving
    ['cancel the effects of the move', 'annulez ce déplacement'],

    // costs
    ['As an additional cost for you to', 'En tant que coût supplémentaire pour que vous puissiez'],
    ['As an additional cost to', 'En tant que coût supplémentaire pour'],
    ['must spend', 'doivent dépenser'],
    ['investigators at your location', 'les investigateurs dans votre lieu'],
    
    // timing
    ['When you would move', 'Quand vous devriez vous déplacer'],
    ['After you end your turn at', 'Après avoir terminé votre tour dans'],
    ['At the end of your turn', 'À la fin de votre tour'],
    ['At the end of the round', 'À la fin du round'],
    ['When your turn ends', 'Quand votre tour se termine'],
    [`When you reveal`, 'Quand vous révélez'],
    [`After you reveal`, 'Après avoir révélé'],
    ['After you defeat', 'Après avoir vaincu'],
    ['When you play', 'Quand vous jouez'],

    // Bad consequences
    ['take 1 direct horror', 'subissez 1 horreur directe'],
    ['1 direct horror', '1 horreur directe'],
    ['take 1 direct damage', 'subissez 1 dégât direct'],
    ['1 direct damage', '1 dégât direct'],
    ['discard 2 random cards from your hand', 'défaussez 2 cartes prises au hasard dans votre main'],
    ['Discard this card from your hand', 'défaussez cette carte de votre main'],
    ['a card from your hand', 'une carte de votre main'],
    ['This effect can cause the current agenda to advance', `Cet effet peut faire avancer l'intrigue en cours`],
    ['this effect may cause the current agenda to advance', `cet effet peut faire avancer l'intrigue en cours`],
    ['You automatically fail', 'vous échouez automatiquement'],

    // Skill tests
    ['is revealed during this test', 'est révélé lors de ce test'],
    ['If you succeed', 'En cas de réussite'],
    ['If you fail', `En cas d'échec`],
    ['After you fail a skill test', `Après avoir échoué à un test de compétence`],
    ['After you fail', `Après avoir échoué`],
    ['For each point you fail by', 'Pour chaque point manquant'],
    ['for each horror on you', 'pour chaque horreur sur vous'],
    ['for each damage on you', 'pour chaque dégât sur vous'],

    // limits/max
    ['Group limit once per game.', `Limite collective d'une fois par partie.`],
    ['Limit 1 per investigator.', `Limite de 1 par investigateur.`],
    ['Limit once per round', `Limite d'une fois par round`],
    ['Limit 1 per location', 'Limite de 1 par lieu'],

    // Campaign-specific
    ['The Path to Carcosa', 'La Route de Carcosa'],
    ['The Dunwich Legacy', `L'Héritage de Dunwich`],

    // return
    ['with the following exceptions', 'en tenant compte des exceptions suivantes'],
    [
        'When gathering encounter sets, also gather the new encounter sets for', 
        'Quand vous réunissez les sets de rencontre, réunissez également les nouveaux sets de rencontre pour'
    ],
    ['shown here.', 'indiqués ci-dessous\u00A0:'],
    [`Construct the act deck`, `Constituez le deck Acte`],
    ['(Continued on reverse side.)', '(Suite au verso.)'],

    // random
    [
        `This card does not count toward that investigator's deck size.`, 
        'Cette carte ne compte pas dans la Taille du deck de cet investigateur'
    ], 
    ['While you are investigating', 'Tant que vous enquêtez'],
    ['Catacombs deck', 'deck Catacombes'],
    ['Ignore the text', 'Ignorez le texte'],
    ['the skill indicated by the investigation attempt', `la compétence indiquée lors de la tentative d'enquête`],
    ['You must (choose one)', 'Vous devez (choisir une option)'],
    ['For the duration of this scenario', 'Pour la durée du scénario'],

    // location
    ['unrevealed locations', 'lieux non-révélés'],
    ['unrevealed location', 'lieu non-révélé'],
    ['at any location', `dans n'importe quel lieu`],
    ['at that location', `dans ce lieu`],
    ['look at the revealed side', 'regardez la face révélée'],
    ['Attach to your location', 'Attachez cette carte à votre lieu'],
    ['Attached location gets', 'Le lieu attaché gagne'],
    ['attached location', 'le lieu attaché'],
    ['When you investigate this location', 'Quand vous enquêtez dans ce lieu'],
    ['After you successfully investigate', 'Après avoir enquêté avec succès'],
    ['while investigating this location', 'pendant que vous enquétiez dans ce lieu'],
    ['of your location', 'de votre lieu'],

    // Arkham LCG concepts / rule words
    ['Secretly add this card to your hand', 'Ajoutez secrètement cette carte à votre main'],
    ['is immune to player card effects', 'est immunisé contre les effets de cartes Joueur'],
    ['while checking your hand size', 'pendant la vérification de votre limite de main'], 
    ['Reveal a random token from the chaos bag', 'révélez un pion pris au hasard dans la réserve du Chaos'],
    ['Check Campaign Log', 'Vérifiez votre Carnet de Campagne'],
    ['the lead investigateur', `l'investigateur principal`],
    ['the victory display', 'la pile de victoire'],
    ['Attach this card to', 'Attachez cette carte à'],
    ['in your threat area', 'dans votre zone de menace'],
    ['it gains surge', `elle gagne Renfort`],
    ['gains surge', `gagne Renfort`],
    ['Shuffle the encounter deck', 'Mélangez le deck Rencontre'],
    ['from the top of the encounter deck', 'du dessus du deck Rencontre'],
    ['encounter deck', 'deck Rencontre'],
    ['encounter discard pile', 'pile de défausse Rencontre'],
    ['discard pile', 'pile de défausse'],
    ['a skill test', 'un test de compétence'],
    ['hand slot', 'emplacement de main'],
    ['upkeep phase', `phase d'entretien`],
    ['enemy phase', `phase des Ennemis`],
    ['the scenario reference card', 'la carte référence du scénario'],
    ['Each investigator', 'Chaque investigateur'],
    ['automatically evade', 'échappez automatiquement'],
    ['on the current agenda', `sur l'intrigue en cours`],
    ['at this location', 'dans ce lieu'],
    ['this location', 'ce lieu'],
    ['farthest from you', 'le plus éloigné de vous'],
    ['After you discover', 'Après avoir découvert'],
    ['from the top of your deck', 'du dessus de votre deck'],
    ['the top card of your deck', 'la carte du dessus de votre deck'],
    ['the token pool', 'la réserve de pions'],
    ['the token bank', 'la réserve de pions'],
    ['is defeated', 'est vaincu'],
    ['place 1 doom', 'placez une fatalité'],
    ['for this attack', 'pour cette attaque'],
    ['attacks you', 'vous attaque'],
    ['cannot take damage', 'ne peut pas subir de dégât'],
    ['Cannot be canceled', 'Ne peut pas être annulé'],
    ['of your deck', 'de votre deck'],
    ['After you leave', 'Après avoir quitté'],
    ['play area', 'zone de jeu'],
    ['play action', 'action Jouer'],
    ['move action', 'action Se Déplacer'],
    ['draw action', 'action Piocher'],
    ['resource action', 'action Ressource'],
    ['during your turn', 'durant votre tour'],
    ['if you did not perform', `si vous n'avez pas effectué`],
    ['in your hand', 'dans votre main'],
    ['from your hand', 'de votre main'],
    ['next skill test', 'prochain test de compétence'],
    ['skill test', 'test de compétence'],
    ['in play', 'en jeu'],
    ['this round', 'à ce round'],

    ['discarded', 'défaussé'],
    ['Discard', 'Défaussez'],
    ['discard', 'défaussez'],
    ['Then,', 'Ensuite,'],
    ['shroud value', 'valeur occulte'],
    ['shroud', 'valeur occulte'],
    ['Hidden', 'Cachée'],
    ['enemy', 'ennemi'],
    ['aloof', 'Distant'],
    ['clue', 'indice'],
    ['+1 fight', '+1 combat'],
    ['+1 evade', '+1 évasion'],
    ['Agenda deck', 'deck Intrigue'],
    ['Agenda', 'Intrigue'],
    ['agenda', 'intrigue'],
    ['Act deck', 'deck Acte'],
    ['Act', 'Acte'],
    ['act ', 'acte '],
    ['treachery', 'traitrise'],
    ['asset', 'soutien'],
    ['investigator', 'investigateur'],
    ['Investigators', 'Les investigateurs'],
    ['locations', 'lieux'],
    ['location', 'lieu'],

    ['<b>Forced</b>', '<b>Forcé</b>'],
    ['<b>Spawn</b>', '<b>Génération</b>'],
    ['Resign', 'Abandon'],
    ['spawn', 'générez'],
    ['Spawn', 'Générez'],
    ['<b>Prey</b>', '<b>Proie</b>'],
    ['<b>Revelation</b>', '<b>Révélation</b>'],
    ['<b>Parley.</b>', '<b>Discussion</b>'],
    ['gains hunter', 'gagne Chasseur'],
    ['Hunter', 'Chasseur'],
    ['Massive', 'Massif'],
    ['Surge', 'Renfort'],
    ['Peril', 'Péril'],
    ['Retaliate', 'Riposte'],
    ['health', 'vie'],
    ['sanity', 'santé mentale'],
    ['resources', 'ressources'],
    [' doom', ' fatalité'],
    ['horror', 'horreur'],
    ['investigate ', 'enquêter '],
    ['fight', 'combattre'],
    ['evade', 'échapper à'],
    ['move', 'se déplacer'],
    ['play', 'jouer'],
    ['weakness', 'faiblesse'],
    ['card', 'carte'],
    ['event', 'événement'],

    // generic words
    ['if able', 'si possible'],
    ['Flip this card', 'Retournez cette carte'],
    ['its revealed side', 'sa face révélée'],
    ['You must', 'Vous devez'],
    ['you must', 'vous devez'],
    ['At the end of', 'À la fin de'],
    ['above', 'au-dessus'],
    ['below', 'en-dessous'],
    ['to the right', 'à droite'],
    ['to the left', 'à gauche'],
    ['farthest', 'le plus éloigné'],
    ['When ', 'Quand '],
    ['underneath', 'sous'],
    ['adjacent to', 'adjacent à'],
    ['attached', 'attaché'],
    ['Attach ', 'Attachez '],
    ['she gains', 'elle gagne'],
    ['Gain', 'gagnez'],
    ['replace it', 'remplacez-la'],
    ['copy', 'exemplaire'],
    ['copies', 'exemplaires'],
    [' and ', ' et '],
    ['the fewest', 'le moins de'],
    ['1 or more', 'au moins 1'],
    ['at least', 'au moins'],
    [' with ', ' avec '],
    [' among ', ' parmi '],
    ['Shuffle', 'Mélangez'],
    ['loses', 'perd'],
    ['hand', 'main'],
    ['Otherwise', 'Sinon'],
    ['If you have', 'Si vous avez'],
    ['you perform', 'vous effectuez'],
    ['lose', 'perdez'],
    [' is ', ' est '],
    ['the ', 'le '],
    [' you  ', ' vous '],

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
        const pattern = 'After <name> is revealed'
        
        const patternToLookForWithName = pattern.replace('<name>', referenceCard.name)
        const toReplaceWithName = `Après que ${translationCard.name} est révélé`;
        
        const patternToLookForWithBackName = pattern.replace('<name>', referenceCard.back_name)
        const toReplaceWithBackName = `Après que ${translationCard.back_name} est révélé`;

        return suggestedText
            .replaceAll(patternToLookForWithName, toReplaceWithName)
            .replaceAll(patternToLookForWithBackName, toReplaceWithBackName)
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(Put (.*) into play)/i
        const matches = suggestedText.match(regExp)

        if(matches){
            return suggestedText.replace(matches[1], `Mettez en jeu ${matches[2]}`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(must spend (.*), as a group)/
        const matches = suggestedText.match(regExp)

        if(matches){
            return suggestedText.replace(matches[1], `doivent dépenser collectivement ${matches[2]}`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(Spend (.*) resource)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `dépensez ${matches[2]} ressource`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(lose (.*) resources)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `perdre ${matches[2]} ressources`)
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
        const regexp = /(deals? (.*) damage)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `inflige ${matches[2]} dégât${matches[2] !== '1' ? 's' : ''}`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(discard the top (.*) cards?)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `défaussez les ${matches[2]} carte${matches[2] !== '1' ? 's' : ''} du dessus`)
        }
        else{
            return suggestedText
        }
    },

    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(either (.*) or (.*))/g
        const matches = suggestedText.matchAll(regExp)

        for(const match of matches){
            suggestedText = suggestedText.replace(match[1], `soit ${match[2]}, soit ${match[3]}`)
        }

        return suggestedText
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(Test (\[.*\] \(.*\)))/ig
        const matches = suggestedText.matchAll(regExp)

        for(const match of matches){
            suggestedText = suggestedText.replace(match[1], `Effectuez un test de ${match[2]}`)
        }

        return suggestedText
    },
    // translate traits
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(\[\[(\w+)\]\])/g
        const matches = suggestedText.matchAll(regExp)

        for(const match of matches){
            suggestedText = suggestedText.replace(match[1], `[[${translateTrait(match[2])}]]`)
        }

        return suggestedText
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(Perform the setup as indicated in (.*) Campaign Guide)/g
        const matches = suggestedText.matchAll(regExp)

        for(const match of matches){
            suggestedText = suggestedText.replace(
                match[1], 
                `Effectuez la mise en place comme indiqué dans le Guide de Campagne ${translateTrait(match[2])}`
            )
        }

        return suggestedText
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(Remove (.*) from the game)/g
        const matches = suggestedText.matchAll(regExp)

        for(const match of matches){
            suggestedText = suggestedText.replace(
                match[1], 
                `Retirez de la partie ${match[2]}`
            )
        }

        return suggestedText
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(Set (.*) aside, out of play)/g
        const matches = suggestedText.matchAll(regExp)

        for(const match of matches){
            suggestedText = suggestedText.replace(
                match[1], 
                `Mettez de côté ${match[2]}, hors jeu`
            )
        }

        return suggestedText
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(put (.*) into play)/g
        const matches = suggestedText.matchAll(regExp)

        for(const match of matches){
            suggestedText = suggestedText.replace(
                match[1], 
                `mettez en jeu ${match[2]}`
            )
        }

        return suggestedText
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(empty (.*)location)/g
        const matches = suggestedText.matchAll(regExp)

        for(const match of matches){
            suggestedText = suggestedText.replace(
                match[1], 
                `lieu ${match[2]}vide`
            )
        }

        return suggestedText
    },

    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {

        return suggestedText
            .replaceAll(referenceCard.name, translationCard.name)
            .replaceAll(referenceCard.back_name, translationCard.back_name)
    },

    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /((\S)\:)/g
        const matches = suggestedText.matchAll(regExp)

        for(const match of matches){
            suggestedText = suggestedText.replace(
                match[1], 
                `${match[2]}\u00A0:`
            )
        }

        return suggestedText
    },
]

/**
 * 
 * @param {string} trait
 */
function translateTrait(trait){
    return traitTranslation.get(trait) || trait
}


/**
 * 
 * @param {string} traitsString
 */
function suggestFrenchTraitsTranslation(traitsString){
    const traits = parseTraits(traitsString)

    return traits
        .map(translateTrait)
        .map(t => t+'.')
        .join(' ')
}



/**
 * 
 * @param {Card} referenceCard 
 * @param {Card} translationCard 
 * @param {TranslatableProperty} property
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
 * @param {TranslatableProperty[number]} property 
 */
export function suggestTranslation(referenceCard, translationCard, property){
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