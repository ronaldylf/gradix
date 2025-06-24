'use client'

import ContactMe from '@/components/ContactMe'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

import { signOut, useSession } from 'next-auth/react'
import Informacional from '@/components/Informacional'

export default function Home() {
    const { data: session } = useSession()

    return (
        <div className="flex flex-col lg:flex-row gap-10 p-4 mt-20 items-center lg:items-start lg:justify-center">
            <Card className="w-full max-w-md shadow-lg rounded-2xl p-6 text-center h-max">
                <div className="mb-4">
                    <img
                        src="/icon.png"
                        alt="ícone gradix"
                        className="h-20 mx-auto"
                    />
                </div>
                <h1 className="text-xl font-semibold">Gradix</h1>
                <ContactMe className="self-center" />

                <div>
                    <p className="text-muted-foreground mb-6 text-justify">
                        Ferramenta desenvolvida para auxiliar estudantes
                        universitários das UFs a organizarem sua grade de
                        horários durante o período de matrícula das disciplinas,
                        de forma rápida e fácil.
                    </p>
                </div>

                <div className="flex flex-col gap-2 w-max self-center">
                    {!session?.user ? (
                        <div className="flex gap-2 justify-between">
                            <Link href="/login">
                                <Button
                                    className="cursor-pointer"
                                    variant="default"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button
                                    className="cursor-pointer"
                                    variant="outline"
                                >
                                    Criar Conta
                                </Button>
                            </Link>
                        </div>
                    ) : null}

                    <div className="flex gap-2 justify-between">
                        <Link href="/dashboard">
                            <Button className="cursor-pointer">
                                Ir para a grade
                            </Button>
                        </Link>
                        {session?.user ? (
                            <Button
                                className="cursor-pointer"
                                onClick={() => signOut()}
                            >
                                Logout
                            </Button>
                        ) : null}
                    </div>
                </div>
            </Card>
            {/* Como funcionam os horários */}
            <Informacional />
        </div>
    )
}
