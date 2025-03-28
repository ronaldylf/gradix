import { IChair } from "./IChair"

export interface ITimeSlot {
    childChair: IChair
    row: number
    col: number
}