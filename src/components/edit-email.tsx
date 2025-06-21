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
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { editUser } from '@/requests/users'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const editEmailSchema = z.object({
    email: z
        .string()
        .email({ message: 'Email inválido' })
        .nonempty({ message: 'Email não pode ser vazio' })
        .min(2, { message: 'Mínimo 2 caracteres' })
        .max(30, { message: 'Máximo 30 caracteres' }),
})

type editEmailType = z.infer<typeof editEmailSchema>

export default function EditEmail() {
    const [openDialog, setOpenDialog] = useState(false)

    const { data: session, update } = useSession()
    const userData = session?.user

    const currentEmail = userData?.email || ''

    const form = useForm<editEmailType>({
        resolver: zodResolver(editEmailSchema),
        defaultValues: {
            email: currentEmail,
        },
    })

    const editEmailMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            return await editUser(id, data)
        },
        onSuccess: async (data) => {
            // update session with new email
            await update({
                ...session,
                user: {
                    ...session?.user,
                    email: data.email,
                },
            })

            // close dialog
            setOpenDialog(false)

            // reset form with new email
            form.reset({ email: data.email })

            toast('Email atualizado com sucesso')
        },
        onError: (e) => {
            toast('Algo deu errado, tente novamente.')
        },
    })

    useEffect(() => {
        if (userData?.email) {
            form.reset({
                email: userData.email,
            })
        }
    }, [userData, form])

    if (!userData) return

    function handleEditPassword(values: editEmailType) {
        if (values.email === currentEmail) {
            console.log('não editou nada, segue o jogo')
        } else {
            editEmailMutation.mutate({
                id: userData?.id || '',
                data: { ...values },
            })
        }
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="outline">Editar Email</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar email</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleEditPassword)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
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
