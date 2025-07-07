'use client'

import { ITimeSlot } from '@/interfaces/ITimeSlot'
import { ITimeTable } from '@/interfaces/ITimeTable'
import { useEffect, useState } from 'react'

interface IAmount {
    amountRequired: number
    amountTotal: number
    amountNotRequired?: number
}

function Amount({
    timeTable,
    className,
}: {
    timeTable: ITimeTable
    className: string
}) {
    const [amounts, setAmounts] = useState<IAmount>({
        amountRequired: 0,
        amountTotal: 0,
    })

    useEffect(() => {
        const alreadyAddedLabels: string[] = []
        const allFilledSlots: ITimeSlot[] = []
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
        const requiredFilledSlots: ITimeSlot[] = allFilledSlots.filter(
            (slot) => {
                return slot.childChair.isRequired === true
            }
        )

        const newAmounts = {
            amountTotal: allFilledSlots.length,
            amountRequired: requiredFilledSlots.length,
            amountNotRequired:
                allFilledSlots.length - requiredFilledSlots.length,
        }
        setAmounts(newAmounts)
    }, [timeTable])

    return (
        <div className={className}>
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
