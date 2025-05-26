export { auth as middleware } from '@/authentication/auth'

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|login|public|icon.png|$|signup).*)',
    ],
}
