import prisma from '@/app/db/db_client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { NextRequest } from 'next/server'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        const deletedTable = await prisma.table.delete({
            where: {
                id,
            },
        })

        return Response.json({ ...deletedTable })
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            const error = { message: '', status: 400 }
            switch (e.code) {
                case 'P2025':
                    error.message = 'Tabela não encontrada'
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
        const editedTable = await prisma.table.update({
            where: { id },
            data: { ...patches },
        })

        return Response.json({ ...editedTable })
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            let errorMessage = ''
            switch (e.code) {
                case 'P2025':
                    errorMessage = 'Tabela não encontrada'
                    break

                default:
                    console.log('erro não encontrado')
            }
            return Response.json({ errorMessage }, { status: 400 })
        }

        throw e
    }
}
