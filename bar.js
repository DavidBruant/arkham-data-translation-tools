//@ts-check

const filled = '█';
const empty = '░';

const BAR_CHARACTER_COUNT = 16;

/**
 * @param {number} value
 * @param {number} max
 */
export function makeBarString(value, max){
    const filledCharsCount = Math.round(value*BAR_CHARACTER_COUNT/max)
    const emptyCharsCount = BAR_CHARACTER_COUNT - Math.round(value*BAR_CHARACTER_COUNT/max)

    return `[${filled.repeat(filledCharsCount)}${empty.repeat(emptyCharsCount)}]`
}