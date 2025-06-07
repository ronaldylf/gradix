'use client'

import { ITimeSlot } from '@/interfaces/ITimeSlot'
import { ITimeTable } from '@/interfaces/ITimeTable'
import { useEffect, useState } from 'react'

interface IAmount {
    amountRequired: number
    amountTotal: number
    amountNotRequired?: number
}

function Amount({ timeTable }: { timeTable: ITimeTable }) {
    const [amounts, setAmounts] = useState<IAmount>({
        amountRequired: 0,
        amountTotal: 0,
    })

    useEffect(() => {
        let alreadyAddedLabels: string[] = []
        let allFilledSlots: ITimeSlot[] = []
        timeTable.data.forEach((row) => {
            row.forEach((slot) => {
                // se não for o slot default e ainda não tiver sido contabilizado
                if (
                    slot.row !== -1 &&
                    alreadyAddedLabels.indexOf(slot.childChair.label) === -1
                ) {
                    allFilledSlots.push(slot)
                    alreadyAddedLabels.push(slot.childChair.label)
                }
            })
        })
        let requiredFilledSlots: ITimeSlot[] = allFilledSlots.filter((slot) => {
            return slot.childChair.isRequired === true
        })

        let newAmounts = {
            amountTotal: allFilledSlots.length,
            amountRequired: requiredFilledSlots.length,
            amountNotRequired:
                allFilledSlots.length - requiredFilledSlots.length,
        }
        setAmounts(newAmounts)
    }, [timeTable])

    return (
        <div className="flex gap-2 text-2xl rounded-sm border-2 p-3 w-full justify-center">
            <div>Optativas: {amounts.amountNotRequired}</div>
            <div> | </div>
            <div>Obrigatórias: {amounts.amountRequired}</div>
            <div> | </div>
            <div>
                <b>Total: {amounts.amountTotal}</b>
            </div>
        </div>
    )
}

export default Amount
