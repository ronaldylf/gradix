import prisma from '@/app/db/db_client'
import { Chair } from '@/interfaces/RequestChair'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const chair: Chair = await request.json()

    try {
        const createdChair = await prisma.chair.create({
            data: { ...chair },
        })

        return Response.json({ ...createdChair })
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            let error = { message: 'Erro desconhecido', status: 400 }
            switch (e.code) {
                case 'P2003':
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
