import { NextRequest } from 'next/server'
import prisma from '../../db/db_client'
import bcrypt from 'bcryptjs'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { saltAndHashPassword } from '@/utils/password'

// Create new user
export async function POST(request: NextRequest) {
    // create user and return custom erros if it's necessary

    const { name, email, password } = await request.json()
    const hashedPassword = await saltAndHashPassword(password)

    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })
        return Response.json({ ...newUser })
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            const error = { message: '' }

            if (e.code === 'P2002') {
                error.message = 'Email já cadastrado'
            }

            return Response.json({ error }, { status: 400 })
        }
        throw e
    }
}

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const email = searchParams.get('email')
        const password = searchParams.get('password')

        if (!email || !password) {
            return Response.json(
                {
                    error: { message: 'Dados insuficientes para verificar' },
                },
                { status: 400 }
            )
        }

        // Faça a busca no banco de dados pelo e-mail e pela senha
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (!user) {
            return Response.json(
                { error: { message: 'Nenhum usuário encontrado' } },
                { status: 404 }
            )
        }

        // check if passwords are valid
        const isPasswordValid = await bcrypt.compare(password, user?.password)

        if (!isPasswordValid) {
            return Response.json(
                { error: { message: 'Senha incorreta' } },
                { status: 404 }
            )
        }

        return Response.json({ ...user })
    } catch (error) {
        return Response.json(
            { message: 'Erro ao verificar usuário' },
            { status: 500 }
        )
    }
}
