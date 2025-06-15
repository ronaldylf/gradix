'use client'

import { auth } from '@/authentication/auth'
import EditUsername from '@/components/edit-username'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useSession } from 'next-auth/react'

export default function UserProfilePanel() {
    const session = useSession()
    const userData = session?.data?.user

    if (!userData) return

    return (
        <div className="flex justify-center mt-5">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Painel de Usuário</CardTitle>
                    <CardDescription>
                        Visualize e gerencie suas informações pessoais.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Seção Nome */}
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Nome
                            </p>
                            <p className="text-lg font-semibold">
                                {userData.name}
                            </p>
                        </div>
                        <EditUsername />
                    </div>

                    {/* Seção Email */}
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Email
                            </p>
                            <p className="text-lg font-semibold">
                                {userData.email}
                            </p>
                        </div>
                        <Button variant="outline">Editar Email</Button>
                    </div>

                    {/* Seção Senha */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Senha
                            </p>
                            <p className="text-lg font-semibold tracking-widest">
                                ••••••••
                            </p>
                        </div>
                        <Button variant="outline">Editar Senha</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
