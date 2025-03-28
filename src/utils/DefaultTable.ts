import { ITimeSlot } from "@/interfaces/ITimeSlot";
import defaultSlot from "./DefaultSlot";
import { ITimeTable } from "@/interfaces/ITimeTable";

function generateDefaultData() {
    const rows: ITimeSlot[][] = []
    for (let i=0; i<=15; i++) {
        const row: ITimeSlot[] = []
        for (let j=0; j<=4; j++) {
            const slot: ITimeSlot = defaultSlot
            row.push(slot)
        }
        rows.push(row)
    }
    return rows
}

export function getDefaultData() {
    const defaultTableData: ITimeSlot[][] = generateDefaultData()
    return defaultTableData
}

export function getDefaultCaption() {
    return "Grade de horários"
}


export function getDefaultTable() {
    const defaultTable: ITimeTable = {
        data: getDefaultData(),
        caption: getDefaultCaption()
    }
    return defaultTable
}