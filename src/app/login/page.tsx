import { auth } from '@/authentication/auth'
import { AlreadyLogged } from '@/components/AlreadyLoggedIn'
import { LoginForm } from '@/components/login-form'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

export default async function Signin() {
    const session = await auth()

    if (session?.user) {
        return <AlreadyLogged />
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Card className="w-full max-w-sm flex flex-col gap-6">
                <CardTitle className="text-center">
                    Entrar com sua conta
                </CardTitle>
                {/* <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription> */}
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    )
}
