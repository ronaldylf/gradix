'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { editUser } from '@/requests/users'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const editPasswordSchema = z
    .object({
        password: z
            .string()
            .nonempty({ message: 'Email não pode ser vazio' })
            .min(8, { message: 'Mínimo 8 caracteres' })
            .max(30, { message: 'Máximo 30 caracteres' }),
        confirmPassword: z
            .string()
            .nonempty({ message: 'Email não pode ser vazio' })
            .min(8, { message: 'Mínimo 8 caracteres' })
            .max(30, { message: 'Máximo 30 caracteres' }),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'As senhas não correspondem',
                path: ['confirmPassword'],
            })
        }
    })

type editPasswordType = z.infer<typeof editPasswordSchema>

export default function EditEmail() {
    const [openDialog, setOpenDialog] = useState(false)

    const { data: session } = useSession()
    const userData = session?.user

    const form = useForm<editPasswordType>({
        resolver: zodResolver(editPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const editPasswordMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            return await editUser(id, data)
        },
        onSuccess: async () => {
            // close dialog
            setOpenDialog(false)

            // reset form
            form.reset()

            toast('Senha atualizada com sucesso')
        },
        onError: () => {
            toast('Algo deu errado, tente novamente.')
        },
    })

    if (!userData) return

    function handleEditPassword(values: editPasswordType) {
        editPasswordMutation.mutate({
            id: userData?.id || '',
            data: { password: values.password },
        })
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="outline">Editar Senha</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar senha</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleEditPassword)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="nova senha"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmar senha</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="confirmação de senha"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit">Salvar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
