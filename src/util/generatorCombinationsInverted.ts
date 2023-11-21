export function getCombinations(str: string) {
    const combinations: string[] = []

    function generateCombinations(prefix: string, remaining: string) {
        if (remaining.length === 0) {
            combinations.push(prefix)
        } else {
            for (let i = 0; i < remaining.length; i++) {
                const char = remaining[i]
                const newPrefix = prefix + char
                const newRemaining = remaining.slice(0, i) + remaining.slice(i + 1)
                generateCombinations(newPrefix, newRemaining)
            }
        }
    }

    generateCombinations('', str)
    return combinations
}

