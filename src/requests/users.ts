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
