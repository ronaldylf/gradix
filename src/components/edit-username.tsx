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

const editNameSchema = z.object({
    name: z
        .string()
        .nonempty({ message: 'Nome não pode ser vazio' })
        .min(2, { message: 'Mínimo 2 caracteres' })
        .max(30, { message: 'Máximo 30 caracteres' }),
})

type editNameType = z.infer<typeof editNameSchema>

export default function EditUsername() {
    const [openDialog, setOpenDialog] = useState(false)

    const { data: session, update } = useSession()
    const userData = session?.user

    const currentName = userData?.name || ''

    const form = useForm<editNameType>({
        resolver: zodResolver(editNameSchema),
        defaultValues: {
            name: currentName,
        },
    })

    const editNameMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            return await editUser(id, data)
        },
        onSuccess: async (data) => {
            // update session jwt
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: data.name,
                },
            })

            // close dialog
            setOpenDialog(false)

            // reset form with new name
            form.reset({ name: data.name })

            toast('Nome atualizado com sucesso')
        },
        onError: () => {
            toast('Algo deu errado, tente novamente.')
        },
    })

    useEffect(() => {
        if (userData?.name) {
            form.reset({
                name: userData.name,
            })
        }
    }, [userData, form])

    if (!userData) return

    function handleEditName(values: editNameType) {
        if (values.name === currentName) {
            console.log('não editou nada, segue o jogo')
        } else {
            editNameMutation.mutate({
                id: userData?.id || '',
                data: { ...values },
            })
        }
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="outline">Editar Nome</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar nome</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleEditName)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="nome" {...field} />
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
