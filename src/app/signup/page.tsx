import { Card, CardContent, CardTitle } from '@/components/ui/card'
import SignupForm from '@/components/signup-form'
import { AlreadyLogged } from '@/components/AlreadyLoggedIn'
import { auth } from '@/authentication/auth'

export default async function Signup() {
    const session = await auth()

    if (session?.user) {
        return <AlreadyLogged />
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Card className="w-full max-w-sm flex flex-col gap-6">
                <CardTitle className="text-center">Criar Conta</CardTitle>
                <CardContent>
                    <SignupForm />
                </CardContent>
            </Card>
        </div>
    )
}
