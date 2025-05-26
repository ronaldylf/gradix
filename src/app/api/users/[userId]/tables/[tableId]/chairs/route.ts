import prisma from '@/app/db/db_client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { NextRequest } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string; tableId: string }> }
) {
    const { tableId } = await params

    try {
        const tableChairs = await prisma.chair.findMany({ where: { tableId } })

        return Response.json([...tableChairs])
    } catch (e) {
        let error = { message: '', status: 400 }
        if (e instanceof PrismaClientKnownRequestError) {
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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string; tableId: string }> }
) {
    const { tableId } = await params

    const deletedChairsCount = await prisma.chair.deleteMany({
        where: {
            tableId,
        },
    })

    return Response.json({ ...deletedChairsCount })
}
