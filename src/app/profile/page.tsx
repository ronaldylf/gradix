import { auth } from '@/authentication/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Profile() {
    const session = await auth()
    const user = session?.user

    return (
        <div className="mt-5 flex justify-center">
            <Card className="w-max">
                <CardHeader>
                    <CardTitle>Informações pessoais</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <p>
                            <b>Nome: </b> {user?.name}
                        </p>

                        <p>
                            <b>Email:</b> {user?.email}
                        </p>

                        <div className="flex items-center gap-2">
                            <b>Senha: </b>
                            <div className="flex gap-0.5">
                                <div className="h-[8px] w-[8px] bg-foreground rounded-full"></div>
                                <div className="h-[8px] w-[8px] bg-foreground rounded-full"></div>
                                <div className="h-[8px] w-[8px] bg-foreground rounded-full"></div>
                                <div className="h-[8px] w-[8px] bg-foreground rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
