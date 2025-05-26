import axios from 'axios'

export async function createTable(userId: string, caption: string) {
    const { data } = await axios.post(`${window.location.origin}/api/tables`, {
        userId,
        caption,
    })

    return data
}

export async function getTable(userId: string, tableId: string) {
    const { data } = await axios.get(
        `${window.location.origin}/api/users/${userId}/tables/${tableId}`
    )

    return data
}

export async function getUserTables(userId: string) {
    // add a pagination limit later
    const { data } = await axios.get(
        `${window.location.origin}/api/users/${userId}/tables`
    )

    return data
}

export async function editTable(tableId: string, newData: any) {
    const { data } = await axios.patch(
        `${window.location.origin}/api/tables/${tableId}`,
        { ...newData }
    )

    return data
}

export async function clearTable(userId: string, tableId: string) {
    const { data } = await axios.delete(
        `${window.location.origin}/api/users/${userId}/tables/${tableId}/chairs`
    )

    return data
}

export async function deleteTable(userId: string, tableId: string) {
    const { data } = await axios.delete(
        `${window.location.origin}/api/tables/${tableId}`
    )

    return data
}
