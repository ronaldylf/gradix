import { CheckIcon } from 'lucide-react'
import Link from 'next/link'

export function AlreadyLogged() {
    return (
        <div className="flex flex-col w-max h-screen m-auto place-items-center justify-center">
            <CheckIcon size={128} />
            <h1 className="text-3xl">Usuário já está logado.</h1>
            <div>
                <Link href={'/'} className="underline">
                    Clique aqui
                </Link>{' '}
                para voltar ao menu inicial.
            </div>
        </div>
    )
}
