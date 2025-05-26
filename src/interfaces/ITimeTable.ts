import { ITimeSlot } from "./ITimeSlot";

export interface ITimeTable {
    data: ITimeSlot[][];
    caption?: string;
}

