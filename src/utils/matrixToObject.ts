import { ITimeSlot } from '@/interfaces/ITimeSlot'
import { getRowTime } from './GetRowTime'

export function matrixToObject(matrix: ITimeSlot[][]) {
    return matrix.map((row_items, row) => {
        return {
            horario: getRowTime(`H${row + 1}`),
            // horarioFormatado: getHorarioTimes(getRowTime(`H${row + 1}`)),
            dia2: row_items[0],
            dia3: row_items[1],
            dia4: row_items[2],
            dia5: row_items[3],
            dia6: row_items[4],
        }
    })
}
