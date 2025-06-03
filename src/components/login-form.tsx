'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Google from './ui/icon-google'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

const commonErrorMessages = {
    nonEmpty: 'Campo não pode ser vazio',
    min5: 'Deve conter no mínimo 5 caracteres',
    max50: 'Deve conter no máximo 50 caracteres',
}

const formSchema = z.object({
    email: z
        .string()
        .nonempty({ message: commonErrorMessages.nonEmpty })
        .email({ message: 'Email inválido' })
        .min(5, { message: commonErrorMessages.min5 })
        .max(50, { message: commonErrorMessages.max50 }),
    password: z
        .string()
        .nonempty({ message: commonErrorMessages.nonEmpty })
        .min(5, { message: commonErrorMessages.min5 })
        .max(50, { message: commonErrorMessages.max50 }),
})

type TLogin = z.infer<typeof formSchema>

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl')
    const router = useRouter()

    const form = useForm<TLogin>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const [error, setError] = useState<string | null>(null)

    async function onSubmit({ ...credentials }) {
        try {
            const result = await signIn('credentials', {
                ...credentials,
                redirect: false,
            })

            if (result?.error) {
                setError('Email ou senha incorretos.')
                return
            }

            setError(null)

            router.push(callbackUrl || '/')
        } catch (e) {
            // Unknown error
            setError('Algo deu errado, tente novamente.')
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="grid gap-3">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="m@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="grid gap-3">
                                <div className="flex items-center">
                                    <FormLabel>Senha</FormLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Esqueceu a senha?
                                    </a>
                                </div>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && <FormMessage>{error}</FormMessage>}

                    <div className="flex flex-col gap-3">
                        <Button type="submit" className="w-full cursor-pointer">
                            Login
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full cursor-pointer"
                        >
                            <Google />
                            Entrar com conta Google
                        </Button>
                    </div>
                </div>
                <div className="mt-4 text-center text-sm">
                    Não tem uma conta?{' '}
                    <a href="/signup" className="underline underline-offset-4">
                        Criar conta
                    </a>
                </div>
            </form>
        </Form>
    )
}
