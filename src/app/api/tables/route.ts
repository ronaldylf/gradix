import prisma from '@/app/db/db_client'
import { IRequestTable } from '@/interfaces/RequestTimeTable'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { NextRequest } from 'next/server'

// Create table
export async function POST(request: NextRequest) {
    const { userId, caption }: IRequestTable = await request.json()

    let errorMessage = ''
    if (!(typeof userId === 'string') || !(typeof caption === 'string')) {
        errorMessage = 'Tipos inválidos'
        return Response.json({ message: errorMessage }, { status: 400 })
    }

    try {
        const createdTable = await prisma.table.create({
            data: {
                userId,
                caption,
            },
        })
        if (!createdTable) {
            return Response.json(
                { errorMessage: 'Dados inválidos' },
                { status: 400 }
            )
        }

        return Response.json({ ...createdTable })
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            switch (e.code) {
                case 'P2003':
                    errorMessage = 'Id inválido'
                    break

                default:
                    console.log('erro não encontrado')
            }

            return Response.json({ errorMessage }, { status: 400 })
        }
        throw e
    }
}
