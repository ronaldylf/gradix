import prisma from '@/app/db/db_client'
import { NextRequest } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params

    const userTables = await prisma.table.findMany({
        where: { userId },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return Response.json([...userTables])
}
