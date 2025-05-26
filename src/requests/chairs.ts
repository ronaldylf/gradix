import { IChair } from '@/interfaces/IChair'
import axios from 'axios'

export async function createChair(chair: IChair) {
    const URL = `${window.location.origin}/api/chairs`

    const { data } = await axios.post(URL, chair)

    return data
}

export async function getChairs(userId: string, tableId: string) {
    const URL = `${window.location.origin}/api/users/${userId}/tables/${tableId}/chairs`

    const { data } = await axios.get(URL)

    return data
}

export async function editChair(chairId: string, newData: any) {
    const URL = `${window.location.origin}/api/chairs/${chairId}`

    const { data } = await axios.patch(URL, { ...newData })

    return data
}

export async function deleteChair(chairId: string) {
    const URL = `${window.location.origin}/api/chairs/${chairId}`

    const { data } = await axios.delete(URL)

    return data
}
