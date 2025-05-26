import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { usePathname, useRouter } from 'next/navigation'
import { createTable } from '@/requests/tables'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form'
import { toast } from 'sonner'

const createTableSchema = z.object({
    caption: z
        .string()
        .min(2, { message: 'Mínimo 2 caracteres.' })
        .max(30, { message: 'Máximo 30 caracteres' }),
})

export default function CreateTableDialog({ open, onOpenChange, userId }: any) {
    const router = useRouter()
    const pathname = usePathname()

    const queryClient = useQueryClient()

    const createTableForm = useForm<z.infer<typeof createTableSchema>>({
        resolver: zodResolver(createTableSchema),
        defaultValues: {
            caption: '',
        },
    })

    const createTableMutation = useMutation({
        mutationFn: async ({
            userId,
            caption,
        }: {
            userId: string
            caption: string
        }) => {
            return await createTable(userId, caption)
        },
        onSuccess: (data) => {
            router.push(`${pathname}?table=${data.id}`)
            toast(`Tabela ${data.caption} criada com sucesso.`)
            queryClient.invalidateQueries({ queryKey: ['userTables'] })
        },
        onError: () => {
            toast('Algo deu errado ao criar a tabela. Tente novamente.')
        },
    })

    function onSubmit(values: z.infer<typeof createTableSchema>) {
        // cria a tabela no banco
        createTableMutation.mutate({
            userId,
            caption: values.caption,
        })

        // fecha o dialog
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar tabela</DialogTitle>
                    <DialogDescription>
                        Dê um nome para sua nova tabela.
                    </DialogDescription>
                </DialogHeader>
                <Form {...createTableForm}>
                    <form
                        onSubmit={createTableForm.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        {/* ************************* */}
                        <FormField
                            control={createTableForm.control}
                            name="caption"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input
                                            minLength={2}
                                            maxLength={30}
                                            placeholder="Tabela123"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" className="cursor-pointer">
                                Salvar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
