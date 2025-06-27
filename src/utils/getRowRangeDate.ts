export function getRowRangeDate(t: string) {
    let start = new Date()
    let end = new Date()

    switch (t) {
        // --- Turno Matutino ---
        case 'M1':
            start.setHours(7, 30)
            end.setHours(8, 20)
            break
        case 'M2':
            start.setHours(8, 20)
            end.setHours(9, 10)
            break
        case 'M3':
            start.setHours(9, 20)
            end.setHours(10, 10)
            break
        case 'M4':
            start.setHours(10, 10)
            end.setHours(11, 0)
            break
        case 'M5':
            start.setHours(11, 10)
            end.setHours(12, 0)
            break
        case 'M6':
            start.setHours(12, 0)
            end.setHours(12, 50)
            break

        // --- Turno Vespertino ---
        case 'T1':
            start.setHours(13, 10)
            end.setHours(14, 0)
            break
        case 'T2':
            start.setHours(14, 0)
            end.setHours(14, 50)
            break
        case 'T3':
            start.setHours(14, 50)
            end.setHours(15, 40)
            break
        case 'T4':
            start.setHours(15, 50)
            end.setHours(16, 40)
            break
        case 'T5':
            start.setHours(16, 40)
            end.setHours(17, 30)
            break
        case 'T6':
            start.setHours(17, 40)
            end.setHours(18, 30)
            break

        // --- Turno Noturno ---
        case 'N1':
            start.setHours(18, 30)
            end.setHours(19, 20)
            break
        case 'N2':
            start.setHours(19, 20)
            end.setHours(20, 10)
            break
        case 'N3':
            start.setHours(20, 20)
            end.setHours(21, 10)
            break
        case 'N4':
            start.setHours(21, 10)
            end.setHours(22, 0)
            break

        default:
            console.log(`Oops! O código de horário "${t}" não é válido.`)
            break
    }

    return {
        start,
        end,
    }
}
