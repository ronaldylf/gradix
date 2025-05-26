import { IChair } from '@/interfaces/IChair'

export function getDefaultChair() {
    const defaultChair: IChair = {
        id: '',
        tableId: '',
        timeCode: '',
        label: '',
        isRequired: true,
        nameCode: '',
    }

    return defaultChair
}
