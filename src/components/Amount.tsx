'use client'

import { ITimeSlot } from '@/interfaces/ITimeSlot'
import { ITimeTable } from '@/interfaces/ITimeTable'
import { Label } from '@radix-ui/react-label'
import React, { useEffect, useState } from 'react'

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
        <div className="flex gap-2 text-2xl rounded-2xl border-2 p-3 px-5 w-max">
            <Label className="cursor-text">
                Optativas: {amounts.amountNotRequired}
            </Label>
            <Label className="cursor-text">|</Label>
            <Label className="cursor-text">
                Obrigatórias: {amounts.amountRequired}
            </Label>
            <Label className="cursor-text">|</Label>
            <Label className="cursor-text underline">
                <b>Total: {amounts.amountTotal}</b>
            </Label>
        </div>
    )
}

export default Amount
