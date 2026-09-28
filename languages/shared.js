//@ts-check

/**
 * 
 * @param {string} traitsString
 * @param {Map<string, string>} traitTranslation 
 */
export function suggestTraitsTranslation(traitsString, traitTranslation){
    const traits = parseTraits(traitsString)

    return traits
        .map(t => traitTranslation.get(t) || t)
        .map(t => t+'.')
        .join(' ')
}

/**
 * @param {string} traitsText 
 * @returns {string[]}
 */
export function parseTraits(traitsText){
    return traitsText
        .split(' ')
        .map( text => text.replace('.', '').trim() )
}

