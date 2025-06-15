import axios, { AxiosError, AxiosResponse } from 'axios'

export async function getUserFromDb({ email, password }: any) {
    const result = await axios
        .get(`${process.env.NEXTAUTH_URL}/api/users`, {
            params: {
                email,
                password,
            },
        })
        .then((resp: AxiosResponse) => {
            return resp.data
        })
        .catch((reason: AxiosError) => {
            return null
        })

    return result
}

export async function editUser(id: string, data: any) {
    if (!data) {
        throw new Error('Invalid data')
    } else if (id === '') {
        throw new Error('Invalid id')
    }

    const result = await axios
        .patch(`${process.env.NEXTAUTH_URL}/api/users/${id}`, { ...data })
        .then((resp: AxiosResponse) => {
            return resp.data
        })
        .catch((reason: AxiosError) => {
            return null
        })

    return result
}
