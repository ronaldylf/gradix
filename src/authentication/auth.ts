import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getUserFromDb } from '@/requests/users'

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials: any) => {
                // logic to verify if the user exists
                const user = await getUserFromDb({ ...credentials })

                if (!user) {
                    // No user found, so this is their first attempt to login
                    // Optionally, this is also the place you could do a user registration
                    throw new Error('Invalid credencials')
                }

                // return user object with their profile data
                return user
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    pages: {
        signIn: '/login',
        signOut: '/signup',
    },
    callbacks: {
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },

        jwt: async ({ token, user, trigger, session }) => {
            if (trigger === 'update') {
                return { ...token, ...session.user }
            }

            token.id = user?.id ?? token.sub
            token.name = user?.name ?? token.name
            token.email = user?.email ?? token.email

            return token
        },

        session: async ({ token, session }) => {
            if (token.sub && session.user) {
                session.user.id = token.sub
                session.user.name = token.name
                session.user.email = token.email || ''
            }
            return session
        },
    },
})
