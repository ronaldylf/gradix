import { IChair } from '@/interfaces/IChair'
import { ITimeSlot } from '@/interfaces/ITimeSlot'
import { getDefaultData } from './DefaultTable'

export function getChairCoordinates(timeCode: string) {
    if (timeCode === '') {
        // verificar se especificou o código
        throw new Error('Cadeira incompleta')
    }

    const letras = timeCode
        .split('')
        .filter((c) => ['M', 'T', 'N'].indexOf(c) !== -1)

    if (letras.length !== 1) {
        // verificar se especificou apenas 1 turno
        throw new Error('Turno mal especificado')
    }

    const turno = letras[0]
    const [ladoEsquerdo, ladoDireito] = timeCode.split(turno)
    const soNumeroRegex = /^\d+$/

    if (!soNumeroRegex.test(ladoEsquerdo) || !soNumeroRegex.test(ladoDireito)) {
        // verifica se contém somente números nos dias e horários
        throw new Error('Dias ou horários mal especificados')
    }

    const nums_dias = ladoEsquerdo.split('')
    const nums_horarios = ladoDireito.split('')

    const dias_validos = nums_dias.filter((num) => {
        return Number(num) >= 2 && Number(num) <= 6
    })

    const horarios_validos = nums_horarios.filter((num) => {
        return Number(num) >= 1 && Number(num) <= 6
    })

    if (
        dias_validos.length !== nums_dias.length ||
        horarios_validos.length !== nums_horarios.length
    ) {
        // verifica se os dias e horários são somente números
        throw new Error('Dias ou horários inválidos')
    }

    const cols = nums_dias.map((value) => {
        return Number(value) - 2
    })

    const rows = nums_horarios.map((value) => {
        if (turno === 'T') {
            return Number(value) - 1 + 6
        }
        if (turno === 'N') {
            return Number(value) - 1 + 12
        }
        return Number(value) - 1 // turno manhã (M)
    })

    return {
        rows,
        cols,
    }
}

export function generateMatrixFormat(chairs: IChair[]): ITimeSlot[][] {
    const matrix = getDefaultData()

    if (chairs) {
        chairs.map((chair: IChair) => {
            const { rows, cols } = getChairCoordinates(chair.timeCode)

            cols.map((col) => {
                rows.map((row) => {
                    matrix[row][col] = {
                        childChair: chair,
                        row,
                        col,
                    }
                })
            })
        })
    }

    return [...matrix]
}
