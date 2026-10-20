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
    const dotSplit = traitsText.split('.')
    
    return dotSplit.slice(0, dotSplit.length -1)
        .map( text => text.trim() )
}

