'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const commonErrorMessages = {
    nonEmpty: 'Campo não pode ser vazio',
    min5: 'Deve conter no mínimo 5 caracteres',
    min2: 'Deve conter no mínimo 2 caracteres',
    max50: 'Deve conter no máximo 50 caracteres',
}

const formSchema = z.object({
    name: z
        .string()
        .nonempty({ message: commonErrorMessages.nonEmpty })
        .min(2, { message: commonErrorMessages.min2 })
        .max(50, { message: commonErrorMessages.max50 }),
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

type TSignup = z.infer<typeof formSchema>

const inputClass = ''
const labelClass = ''
const errorClass = ''

export default function SignupForm() {
    const form = useForm<TSignup>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            name: '',
            password: '',
        },
    })

    const router = useRouter()

    async function onSubmit(values: TSignup) {
        await axios
            .post('/api/users', {
                ...values,
            })
            .then((res) => {
                // all worked well
                router.replace('/login')
            })
            .catch((reason: AxiosError) => {
                // const resp: any = reason.response?.data
                toast('Algo deu errado, tente novamente.')
            })
    }

    return (
        <Form {...form}>
            <form
                className="flex flex-col space-y-4 w-full"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Nome</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Nome"
                                    className={inputClass}
                                    {...field}
                                />
                            </FormControl>
                            {/* <FormDescription>
                                some description here
                            </FormDescription> */}
                            <FormMessage className={errorClass} />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Email"
                                    className={inputClass}
                                    {...field}
                                />
                            </FormControl>
                            {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                            <FormMessage className={errorClass} />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass}>Senha</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Senha"
                                    className={inputClass}
                                    {...field}
                                />
                            </FormControl>
                            {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                            <FormMessage className={errorClass} />
                        </FormItem>
                    )}
                />

                <Button type="submit" className={'h-full cursor-pointer'}>
                    Criar minha conta
                </Button>
            </form>
        </Form>
    )
}
