import prisma from '@/app/db/db_client'
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library'
import { NextRequest } from 'next/server'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params

    const patches: any = await request.json()

    console.log('chegou até aqui no patch')

    try {
        const editedUser = await prisma.user.update({
            where: { id: userId },
            data: { ...patches },
            omit: {
                password: true,
            },
        })
        return Response.json({ ...editedUser })
    } catch (e) {
        let error = { message: 'erro não identificado', status: 400 }
        if (e instanceof PrismaClientKnownRequestError) {
            switch (e.code) {
                case 'P2025':
                    error.message = 'Usuário não encontrado'
                    break

                default:
                    console.log(error.message)
            }
        } else if (e instanceof PrismaClientValidationError) {
            error.message = 'Dados inválidos'
        }

        return Response.json(
            { message: error.message },
            { status: error.status }
        )
    }
}
