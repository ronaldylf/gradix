export function getRowTime(t: string) {
    const num = Number(t.split('H')[1])
    if (num >= 1 && num <= 6) {
        return `M${num}`
    } else if (num >= 7 && num <= 12) {
        return `T${num-6}`
    } else if (num >= 13 && num <= 16) {
        return `N${num-12}`
    }

    return t
}