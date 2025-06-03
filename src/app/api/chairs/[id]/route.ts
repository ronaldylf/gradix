import prisma from '@/app/db/db_client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { NextRequest } from 'next/server'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        const deletedChair = await prisma.chair.delete({
            where: {
                id,
            },
        })

        return Response.json({ ...deletedChair })
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            let error = { message: 'Erro desconhecido', status: 400 }
            switch (e.code) {
                case 'P2025':
                    error.message = 'Cadeira não encontrada'
                    error.status = 404
                    break

                default:
                    console.log('erro não encontrado')
            }
            return Response.json(
                { message: error.message },
                { status: error.status }
            )
        }
        throw e
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    const patches: any = await request.json()

    //protect from 'patches' edit id

    try {
        const editedChair = await prisma.chair.update({
            where: { id },
            data: { ...patches },
        })

        return Response.json({ ...editedChair })
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            let errorMessage = ''
            switch (e.code) {
                case 'P2025':
                    errorMessage = 'Cadeira não encontrada'
                    break

                default:
                    console.log('erro não encontrado')
            }
            return Response.json({ errorMessage }, { status: 400 })
        }

        throw e
    }
}
