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
    'Geist',
    'Avatar',

    // tcu
    'Tarot',
    'Service',
    'Spectral',

    // tfa
    'Serpent',

    // eoe
    'Entrepreneur',

    // fhv
    'Double',

    // side
    'Bayou',
    'Dhole',
    'Gug',
    'Prison',
    'Distorsion',
    'Machination',
    'Tindalos',
    'Innocent',
    'Hall',
    'Mi-Go',
])

export const traitTranslation = new Map([
    // player cards
    [`Item`, `Objet`],
    [`Tool`, `Outil`],
    [`Spell`, `Sort`],
    [`Relic`, `Relique`],
    ['Ally', 'Allié'],

    // scenario cards
    ['Criminal', 'Criminel'],
    ['Humanoid', 'Humanoïde'],
    ['Bystander', 'Passant'],
    ['Cultist', 'Cultiste'],
    ['Elite', 'Élite'],
    [`Past`, `Passé`],
    [`Present`, `Présent`],
    [`Future`, `Futur`],
    [`Portal`, `Portail`],
    [`Scientist`, `Scientifique`],
    [`Plot`, `Complot`],
    [`Syndicate`, `Syndicat`],
    [`Ancient One`, `Grand Ancien`],
    [`Monster`, `Monstre`],
    [`Extradimensional`, `Extradimensionnel`],
    [`Hex`, `Sortilège`],
    [`Scheme`, `Manigance`],
    [`Hazard`, `Risque`],
    [`Power`, `Pouvoir`],
    [`Terror`, `Terreur`],
    [`Woods`, `Bois`],
    [`Silver Twilight`, `Crépuscule d'Argent`],
    [`Otherworld`, `Autre Monde`],
    [`Witch`, `Ensorceleur`],
    [`Curse`, `Malédiction`],
    [`Lodge`, `Loge`],
    [`Sanctum`, `Sanctuaire`],
    [`Void`, `Néant`],
    [`Nightgaunt`, `Maigre Bête de la Nuit`],
    [`Omen`, `Présage`],
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

    //tfa
    'Persuasion',
    'Sacrifice',
    'Coup de Grâce',
    'Thermos',

    // tcu
    'Terrible Secret',
    'Baron Samedi',
    'De Vermis Mysteriis',
    'Eucatastrophe',

    // tde
    'Versatile',

    // tic
    'Armageddon',
    'Ríastrad',
    'Signum Crucis',

    // eoe
    `Livre d'Eibon`,
    'Discipline',
    'Prophesiae Profana',
    'Bandages',

    // fhv
    'Ad Hoc',
    'Katana',
    'Ofuda',
    'Absolution',
    'Microscope',
    'British Bull Dog',
    'Vamp',

    // tdc
    'Ocula Obscura',
    'Confiscation',
    'Oculus Mortuum',
    'Antikythera',
    'Luger P08',
    'Intimidation',
    'Doppelgänger',
    'Mauser Tankgewehr M1918',

    // side
    'Garden District',
    'Broadmoor',
    'Faubourg Marigny',
    // carnavale of horror
    'Bauta',
    'Medico Della Peste',
    'Pantalone',
    // machinations
    'Tindalos',
    'Tindalos Alpha',
    'Thomas Corrigan',
    'Mary Zielinski',
    // hotel
    'Restaurant',

])

// flavor texts that are exactly the same in French as in English
export const sameTranslationFlavor = new Set([
    'Negotium perambulans in tenebris...',
    'Ding, ding, ding!',
])



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
        const regExp = /(the set-aside (.*?) enemy)/i
        const matches = suggestedText.match(regExp)

        if(matches){
            return suggestedText.replace(matches[1], `l'ennemi ${matches[2]} mis de côté`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(Put (.*?) into play)/i
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
        const regExp = /(must spend (.*?),? as a group)/
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
        const regExp = /(spend (.*?),? as a group)/
        const matches = suggestedText.match(regExp)

        if(matches){
            return suggestedText.replace(matches[1], `dépensent collectivement ${matches[2]}`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(Spend (.*?) resource)/i
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
        const regexp = /(lose (.*?) resources)/i
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
        const regexp = /(suffers? (\d) mental trauma)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `subit ${matches[2]} traumatisme${matches[2] !== '1' ? 's' : ''} mental`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(suffers? (\d) physical trauma)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `subit ${matches[2]} traumatisme${matches[2] !== '1' ? 's' : ''} physique`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(Heal (.*?) horror)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `soignez ${matches[2]} horreur${matches[2] !== '1' ? 's' : ''}`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(deals? (.*?) damage to)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `infligez ${matches[2]} dégât${matches[2] !== '1' ? 's' : ''} à`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(deals? (.*?) damage)/i
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
        const regexp = /(deals? (.*?) horror to)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `infligez ${matches[2]} horreur${matches[2] !== '1' ? 's' : ''} à`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(deals? (.*?) horror)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `infligez ${matches[2]} horreur${matches[2] !== '1' ? 's' : ''}`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(discard the top (.*?) cards?)/i
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
        const regexp = /(draw the topmost (.*?) in the encounter discard pile)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `piochez ${matches[2]} la plus proche du sommet de la pile de défausse Rencontre`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(Draw (.*?) cards?)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `piochez ${matches[2]} carte${matches[2] !== '1' ? 's' : ''}`)
        }
        else{
            return suggestedText
        }
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regexp = /(Lose (.*?) actions?)/i
        const matches = suggestedText.match(regexp)

        if(matches){
            return suggestedText.replace(matches[1], `perdez ${matches[2]} action${matches[2] !== '1' ? 's' : ''}`)
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
        const regExp = /(Test (\[.*?\] \(.*?\)))/ig
        const matches = suggestedText.matchAll(regExp)

        for(const match of matches){
            suggestedText = suggestedText.replace(match[1], `effectuez un test de ${match[2]}`)
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
        const regExp = /(Remove (.*?) from the game)/g
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
        const regExp = /(Set (.*?) aside, out of play)/g
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
        const regExp = /(put (.*?) into play)/g
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
        const regExp = /(while it is at a (.*?) location)/g
        const matches = suggestedText.matchAll(regExp)

        for(const match of matches){
            suggestedText = suggestedText.replace(
                match[1], 
                `tant qu'il est dans un lieu ${match[2]}`
            )
        }

        return suggestedText
    },
    // @ts-ignore
    (suggestedText, referenceCard, translationCard) => {
        const regExp = /(empty (.*?)location)/g
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



const staticReplacements = new Map([
    
    // moving
    ['cancel the effects of the move', 'annulez ce déplacement'],

    // costs
    ['As an additional cost for you to', 'En tant que coût supplémentaire pour que vous puissiez'],
    ['as an additional cost for you to', 'en tant que coût supplémentaire pour'],
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
    ['When an investigator is eliminated', `Quand un investigateur est éliminé`], 
    ['When you discover', `Quand vous découvrez`],

    // Bad consequences
    ['Take 1 direct horror', 'Subissez 1 horreur directe'],
    ['take 1 direct horror', 'subissez 1 horreur directe'],
    ['1 direct horror', '1 horreur directe'],
    ['Take 1 direct damage', 'Subissez 1 dégât direct'],
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
    ['for each point you succeeded by', `pour chaque point de réussite`],
    ['For each point you fail by', 'Pour chaque point manquant'],
    ['for each horror on you', 'pour chaque horreur sur vous'],
    ['for each damage on you', 'pour chaque dégât sur vous'],

    // limits/max
    ['Group limit once per game', `Limite collective d'une fois par partie`],
    ['Limit once per game', `Limite d'une fois par partie`],
    ['Group limit once per round', `Limite collective d'une fois par round`],
    ['Group limit once per turn', `Limite collective d'une fois par tour`],
    ['Limit 1 per investigator.', `Limite de 1 par investigateur.`],
    ['Limit once per turn', `Limite d'une fois par tour`],
    ['Limit once per round', `Limite d'une fois par round`],
    ['Limit 1 per location', 'Limite de 1 par lieu'],
    ['Limit 1 per asset', 'Limite 1 par soutien'],

    // Campaign-specific
    ['The Path to Carcosa', 'La Route de Carcosa'],
    ['The Dunwich Legacy', `L'Héritage de Dunwich`],
    ['The Circle Undone', `Le Cercle Brisé`],

    ['to the location in the clockwise direction', 'au lieu suivant dans le sens horaire'],
    [
        'his location is connected to the location in the counter-clockwise direction, as well as the clockwise direction',
        'son lieu est à la fois connexe au lieu situé dans le sens antihoraire et au lieu dans le sens horaire'
    ],
    ['"Missing Persons" section of your Campaign Log', 'section "Personnes disparues" du Carnet de Campagne'],
    ['Announce', 'annoncez que'],
    ['Catacombs deck', 'deck Catacombes'],

    // return
    ['with the following exceptions', 'en tenant compte des exceptions suivantes'],
    ['the following additional rule applies', `appliquez la règle supplémentaire suivante`],
    [
        'When gathering encounter sets, also gather the new encounter sets for', 
        'Quand vous réunissez les sets de rencontre, réunissez également les nouveaux sets de rencontre pour'
    ],
    ['as a reminder', `en tant qu'aide-mémoire`],
    ['shown here.', 'indiqués ci-dessous\u00A0:'],
    [`Construct the act deck`, `Constituez le deck Acte`],
    ['(Continued on reverse side.)', '(Suite au verso.)'],

    // random
    [
        `This card does not count toward that investigator's deck size.`, 
        'Cette carte ne compte pas dans la Taille du deck de cet investigateur'
    ], 
    

    // location
    ['while investigating this location', 'pendant que vous enquétiez dans ce lieu'],
    ['When you investigate this location', 'Quand vous enquêtez dans ce lieu'],
    ['enters a location', 'entre dans un lieu'],
    ['After you successfully investigate', 'Après avoir enquêté avec succès'],
    ['Attach to your location', 'Attachez cette carte à votre lieu'],
    ['look at the revealed side', 'regardez la face révélée'],
    ['Attached location gets', 'Le lieu attaché gagne'],
    ['attached location', 'le lieu attaché'],
    ['unrevealed locations', 'lieux non-révélés'],
    ['unrevealed location', 'lieu non-révélé'],
    ['nearest location', `lieu le plus proche`],
    ['at any location', `dans n'importe quel lieu`],
    ['at that location', `dans ce lieu`],
    ['at its location', `dans son lieu`],
    ['at your location', `dans votre lieu`],
    ['at this location', 'dans ce lieu'],
    ['of your location', 'de votre lieu'],
    ['to your location', `vers votre lieu`],
    ['from this location', 'de ce lieu'],
    ['this location', 'ce lieu'],

    // deck
    [
        `Shuffle the encounter discard pile into the encounter deck.`, 
        `mélangez la pile de défausse Rencontre dans le deck Rencontre.`
    ],
    ['Shuffle the encounter deck', 'Mélangez le deck Rencontre'],
    ['the top card of the encounter deck', 'la carte du dessus du deck Rencontre'],
    ['from the top of the encounter deck', 'du dessus du deck Rencontre'],
    ['next to the agenda deck', `à coté du deck Intrigue`],
    ['from the top of your deck', 'du dessus de votre deck'],
    ['the top card of your deck', 'la carte du dessus de votre deck'],
    ['Act deck', 'deck Acte'],
    ['act deck', 'deck Acte'],
    ['Agenda deck', 'deck Intrigue'],
    ['agenda deck', 'deck Intrigue'],
    ['encounter deck', 'deck Rencontre'],
    ['of your deck', 'de votre deck'],
    ['into your deck', 'dans votre deck'],

    // Arkham LCG concepts / rule words
    ['While you are investigating', 'Tant que vous enquêtez'],
    ['Ignore the text', 'Ignorez le texte'],
    ['the skill indicated by the investigation attempt', `la compétence indiquée lors de la tentative d'enquête`],
    ['You must (choose one)', 'Vous devez (choisir une option)'],
    ['For the duration of this scenario', 'Pour la durée du scénario'],
    ['investigators may', `les investigateurs ont le droit de`],
    ['Secretly add this card to your hand', 'Ajoutez secrètement cette carte à votre main'],
    ['is immune to player card effects', 'est immunisé contre les effets de cartes Joueur'],
    ['while checking your hand size', 'pendant la vérification de votre limite de main'], 
    ['Reveal a random token from the chaos bag', 'révélez un pion pris au hasard dans la réserve du Chaos'],
    ['reveal a random token from the chaos bag', 'révélez un pion pris au hasard dans la réserve du Chaos'],
    ['This action does not provoke attacks of opportunity', `Cette action ne provoque pas d'attaques d'opportunité`],
    ['While resolving the hunter keyword', 'Tant que vous résolvez le mot-clé Chasseur'],
    ['Check Campaign Log', 'Vérifiez votre Carnet de Campagne'],
    ['Record in your Campaign Log', `Indiquez dans votre Carnet de Campagne`],
    ['this test is automatically successful', 'ce test réussit automatiquement'],
    ['Campaign Log', `Carnet de Campagne`],
    ['The lead investigator', `L'investigateur principal`],
    ['the lead investigator', `l'investigateur principal`],
    ['add it to the victory display', 'ajoutez-la à la pile de victoire'],
    ['to the victory display', 'à la pile de victoire'],
    ['the victory display', 'la pile de victoire'],
    ['When you would draw', 'Quand vous devriez piocher'],
    ['Attach this card to', 'Attachez cette carte à'],
    ['in your threat area', 'dans votre zone de menace'],
    ['the requisite number of clues', `le nombre d'indices requis`],
    ['If there are no clues', `S'il n'y a aucun indice`],
    ['the last clue', `le dernier indice`],
    ['it gains surge', `elle gagne Renfort`],
    ['gains surge', `gagne Renfort`],
    ['gains peril', `gagne Péril`],
    ['encounter discard pile', 'pile de défausse Rencontre'],
    ['discard pile', 'pile de défausse'],
    ['a skill test', 'un test de compétence'],
    ['hand slot', 'emplacement de main'],
    ['the mythos phase', `la phase du Mythe`],
    ['mythos phase', `phase du Mythe`],
    ['the enemy phase', `la phase des Ennemis`],
    ['enemy phase', `phase des Ennemis`],
    ['the upkeep phase', `la phase d'entretien`],
    ['upkeep phase', `phase d'entretien`],
    ['with no investigators', 'sans investigateur'],
    ['the scenario reference card', 'la carte référence du scénario'],
    ['Each remaining investigator', `Chaque investigateur restant`],
    ['Each investigator must', 'Chaque investigateur doit'],
    ['Each investigator', 'Chaque investigateur'],
    ['Automatically evade', 'échappez automatiquement'],
    ['automatically evade', 'échappez automatiquement'],
    ['on the current agenda', `sur l'intrigue en cours`],
    ['on this agenda', `sur cette intrigue`],
    ['farthest from you', 'le plus éloigné de vous'],
    ['After you discover', 'Après avoir découvert'],
    ['from the token pool', 'pris dans la réserve de pions'],
    ['the token pool', 'la réserve de pions'],
    ['the token bank', 'la réserve de pions'],
    ['is defeated', 'est vaincu'],
    ['place 1 doom', 'placez une fatalité'],
    ['for this attack', 'pour cette attaque'],
    ['attacks you', 'vous attaque'],
    ['cannot take damage', 'ne peut pas subir de dégât'],
    ['Cannot be canceled', 'Ne peut pas être annulé'],
    ['cannot be canceled', 'ne peut pas être annulé'],
    ['for the remainder of the game', 'pour le reste de la partie'],
    ['For the remainder of the scenario', 'Pour le reste du scénario'],
    ['After you leave', 'Après avoir quitté'],
    ['play area', 'zone de jeu'],
    ['play action', 'action Jouer'],
    ['move action', 'action Se Déplacer'],
    ['draw action', 'action Piocher'],
    ['resource action', 'action Ressource'],
    ['during your turn', 'durant votre tour'],
    ['your turn', 'votre tour'],
    ['if you did not perform', `si vous n'avez pas effectué`],
    ['in your hand', 'dans votre main'],
    ['from your hand', 'de votre main'],
    ['next skill test', 'prochain test de compétence'],
    ['skill test', 'test de compétence'],
    ['from the chaos bag', 'de la réserve du Chaos'],
    ['In player order', `Dans l'ordre des joueurs`],
    ['have been triggered', `ont été déclenchées`],
    ['triggered', `déclenchées`],
    ['trigger', `déclencher`],
    ['in play', 'en jeu'],
    ['this round', 'à ce round'],
    ['on any card', `sur n'importe quelle carte`],
    ['its revelation effect', `son effet Révélation`],
    ['Epic Multiplayer Mode', `Mode Multijoueur Épique`],
    ['you control', 'que vous contrôlez'],
    ['proceed to', `continuez à`],
    ['cannot be damaged', 'ne peut pas être blessé'],

    ['discarded', 'défaussé'],
    ['Discard', 'Défaussez'],
    ['discard', 'défaussez'],
    ['Then,', 'Ensuite,'],
    ['shroud value', 'valeur occulte'],
    ['shroud', 'valeur occulte'],
    ['Hidden', 'Cachée'],
    ['enemies', 'ennemis'],
    ['enemy', 'ennemi'],
    ['clue', 'indice'],
    ['+1 fight', '+1 combat'],
    ['+1 evade', '+1 évasion'],
    ['Agenda', 'Intrigue'],
    ['agenda', 'intrigue'],
    ['Act', 'Acte'],
    ['act ', 'acte '],
    ['threat area', `zone de menace`],
    ['treachery', 'traîtrise'],
    ['asset', 'soutien'],
    ['The investigators', 'Les investigateurs'],
    ['Investigators', 'Les investigateurs'],
    ['investigator', 'investigateur'],
    ['locations', 'lieux'],
    ['location', 'lieu'],
    ['undefeated', 'non-vaincu'],
    ['Abilities', `Les capacités`],
    ['abilities', `les capacités`],

    ['<b>Forced</b>', '<b>Forcé</b>'],
    ['<b>Spawn</b>', '<b>Génération</b>'],
    ['Resign', 'Abandon'],
    ['spawns', 'génère'],
    ['spawn', 'générez'],
    ['Spawn', 'Générez'],
    ['<b>Prey</b>', '<b>Proie</b>'],
    ['<b>Revelation</b>', '<b>Révélation</b>'],
    ['<b>Parley.</b>', '<b>Discussion</b>.'],
    ['<b>Objective</b>', '<b>Objectif</b>'],
    ['<b>Move</b>', '<b>Se Déplacer</b>'],
    ['<b>Fight.</b>', '<b>Combattre</b>.'],
    ['<b>Evade.</b>', '<b>Échapper à</b>.'],
    ['<b>Setup</b>', '<b>Mise en Place</b>'],
    ['gains hunter', 'gagne Chasseur'],
    ['Hunter', 'Chasseur'],
    ['Patrol', `Patrouille`],
    ['Massive', 'Massif'],
    ['Surge', 'Renfort'],
    ['Peril', 'Péril'],
    ['Retaliate', 'Riposte'],
    ['retaliate', 'Riposte'],
    ['Alert', 'Alerte'],
    ['alert', 'Alerte'],
    ['Aloof', 'Distant'],
    ['aloof', 'Distant'],
    ['health', 'vie'],
    ['sanity', 'santé mentale'],
    ['resource', 'ressource'],
    [' doom', ' fatalité'],
    ['horror', 'horreur'],
    ['investigate ', 'enquêter '],
    ['Fight', 'Combattre'],
    ['fight', 'combattre'],
    ['Evade', 'Échapper à'],
    ['evade', 'échapper à'],
    [' move', ' se déplacer'],
    ['out of play', 'hors jeu'],
    ['play', 'jouer'],
    ['weakness', 'faiblesse'],
    ['draws', 'pioche'],
    ['draw', 'pioche'],
    ['commit', 'attribuer'],
    ['this card', 'cette carte'],
    ['this story card', 'cette carte Histoire'],
    ['card', 'carte'],
    ['event', 'événement'],
    ['damage', 'dégât'],
    ['horror', 'horreur'],
    ['ready, unengaged', `redressé et non-engagé`],
    ['Ready', `redressez`],
    ['ready', `redressé`],
    ['exhausted', `incliné`],
    ['exhaust', `inclinez`],
    ['unengaged', `non-engagé`],
    ['non-permanent', `non-Permanent`],
    ['by this effect', 'par cet effet'],
    ['effect ', 'effet '],
    ['effects ', 'effets '],
    ['difficulty', 'difficulté'],
    ['story', 'Histoire'],
    ['→R', '→C'],

    // generic words
    ['If there are no', `S'il n'y a pas de`],
    ['if able', 'si possible'],
    ['runs out of', 'tombe à court de'],
    ['its revealed side', 'sa face révélée'],
    ['You must', 'Vous devez'],
    ['you must', 'vous devez'],
    ['At the end of', 'À la fin de'],
    ['above', 'au-dessus'],
    ['below', 'en dessous'],
    ['to the right', 'à droite'],
    ['to the left', 'à gauche'],
    ['farthest', 'le plus éloigné'],
    ['is connected', 'est connexe'],
    ['When ', 'Quand '],
    ['After ', 'Après '],
    ['underneath', 'sous'],
    [', to advance', ' pour avancer'],
    ['to advance', 'pour avancer'],
    ['advance', 'avancez'],
    ['adjacent to', 'adjacent à'],
    [' on it', ' dessus'],
    ['Flip it over', `Retournez-la`],
    ['Flip back', 'Retournez'],
    ['flip back', 'retournez'],
    ['Flip', 'Retournez'],
    ['flip', 'retournez'],
    ['immediately', 'immédiatement'],
    ['attached', 'attaché'],
    ['Attach ', 'Attachez '],
    ['she gains', 'elle gagne'],
    ['Gain', 'gagnez'],
    ['gains', 'gagne'],
    ['gain', 'gagnez'],
    ['Spend', 'Dépensez'],
    ['keyword', 'mot-clé'],
    ['replace it', 'remplacez-la'],
    ['copy', 'exemplaire'],
    ['copies', 'exemplaires'],
    ['1 or more', 'au moins 1'],
    ['or more', 'ou plus'],
    ['and/or', 'et/ou'],
    [' and ', ' et '],
    [' or ', ' ou '],
    ['the fewest', 'le moins de'],
    ['at least', 'au moins'],
    [' with ', ' avec '],
    [' among ', ' parmi '],
    ['Shuffle', 'Mélangez'],
    ['gets', 'gagne'],
    ['loses', 'perd'],
    ['lose', 'perdez'],
    ['Place', 'placez'],
    ['Remove', 'Retirez'],
    ['remove', 'retirez'],
    [' add', ' ajoutez'],
    ['hand', 'main'],
    ['Otherwise', 'Sinon'],
    ['otherwise', 'sinon'],
    ['If you have', 'Si vous avez'],
    ['you perform', 'vous effectuez'],
    ['For each', 'Pour chaque'],
    ['for each', 'pour chaque'],
    ['each', 'chaque'],
    ['it is', `c'est`],
    [' is ', ' est '],
    [' the ', ' le '],
    [' you,', ' vous,'],
    [' you ', ' vous '],
    [' as if ', ' comme si '],
    [' if ', ' si '],
    ['If ', 'Si '],

])


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
 * @param {Map<string, string>} [nameTranslations] translation of cards names in case referenceCard references other cards
 */
function suggestFrenchTextTranslation(referenceCard, translationCard, property, nameTranslations = new Map()){
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
 * @param {TranslatableProperty[number]} property 
 * @param {Map<string, string>} [nameTranslations] translation of cards names in case referenceCard references other cards
 */
export function suggestTranslation(referenceCard, translationCard, property, nameTranslations){
    if(property === 'name' || property === 'back_name' || property === 'flavor' || property === 'back_flavor'){
        return undefined
    }

    if(property === 'traits' && referenceCard[property]){
        return suggestFrenchTraitsTranslation(referenceCard[property])
    }

    if(property === 'text' || property === 'back_text'){
        return suggestFrenchTextTranslation(referenceCard, translationCard, property, nameTranslations)
    }
}