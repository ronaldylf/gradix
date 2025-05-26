import { getChairCoordinates } from './generateMatrixFormat'
import { ITimeTable } from '@/interfaces/ITimeTable'

interface ICheckConflict {
    chair: { timeCode: string; label: string; isRequired: boolean }
    currentTable: ITimeTable
}

export function getConflictingChair({ chair, currentTable }: ICheckConflict) {
    const { rows, cols } = getChairCoordinates(chair.timeCode)
    const tableData = currentTable.data

    // veriicar se "cabe" na grade de horários
    const primeiraLinhaJaPreenchida = tableData.find((row, idx_row) => {
        return (
            idx_row >= rows[0] &&
            idx_row <= rows[rows.length - 1] &&
            row.filter((chair) => chair.childChair.label !== '').length !== 0
        )
    })

    if (primeiraLinhaJaPreenchida) {
        const cadeiraJaPreenchida = primeiraLinhaJaPreenchida?.find(
            (_, idx_col) => {
                return idx_col >= cols[0] && idx_col <= cols[cols.length - 1]
            }
        )

        if (cadeiraJaPreenchida?.childChair.label !== '') {
            return cadeiraJaPreenchida?.childChair
        }
    }

    return
}
