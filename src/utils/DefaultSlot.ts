import { ITimeSlot } from '@/interfaces/ITimeSlot'
import { getDefaultChair } from './DefaultChair'

export function getDefaultSlot() {
    const defaultSlot: ITimeSlot = {
        childChair: getDefaultChair(),
        col: -1,
        row: -1,
    }

    return defaultSlot
}

export function isDefaultSlot(slot: ITimeSlot) {
    if (slot.row === -1 || slot.col === -1) return true
    return false
}
