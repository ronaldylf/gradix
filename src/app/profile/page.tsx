'use client'

import EditEmail from '@/components/edit-email'
import EditPassword from '@/components/edit-password'
import EditUsername from '@/components/edit-username'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { MoveLeftIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function UserProfilePanel() {
    const session = useSession()
    const userData = session?.data?.user

    if (!userData) return

    return (
        <div className="flex justify-center mt-5">
            <Card className="w-full max-w-lg">
                <div className="flex w-full align-middle ml-2">
                    <Link href="/dashboard" className="h-max">
                        <Button
                            size="icon"
                            variant="outline"
                            className="cursor-pointer"
                        >
                            <MoveLeftIcon />
                        </Button>
                    </Link>
                    <CardHeader className="w-full">
                        <CardTitle>Painel de Usuário</CardTitle>
                        <CardDescription>
                            Visualize e gerencie suas informações pessoais.
                        </CardDescription>
                    </CardHeader>
                </div>
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
                        <EditEmail />
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
                        <EditPassword />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
