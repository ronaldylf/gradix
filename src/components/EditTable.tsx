'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
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
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editTable } from '@/requests/tables'

const editTableShema = z.object({
    caption: z
        .string()
        .nonempty({ message: 'Nome não pode ser vazio.' })
        .min(2, { message: 'Mínimo 2 caracteres.' })
        .max(30, { message: 'Máximo 30 caracteres.' }),
})

type TEditTable = z.infer<typeof editTableShema>

export default function EditTable({
    tableId,
    currentCaption,
}: {
    tableId: string
    currentCaption: string
}) {
    const form = useForm<TEditTable>({
        resolver: zodResolver(editTableShema),
        defaultValues: {
            caption: '',
        },
    })

    const [isEditing, setIsEditing] = useState(false)

    const queryClient = useQueryClient()
    const editTableMutation = useMutation({
        mutationFn: async ({ newData }: any) => {
            console.log('newData = ', { ...newData })
            return await editTable(tableId, { ...newData })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mainTable'] })
            queryClient.invalidateQueries({ queryKey: ['userTables'] })
            // fechar o sheet
            setIsEditing(false)

            // resetar o form
            form.reset()

            // mandar o aviso que foi editada com sucesso
            toast('Tabela atualizada com sucesso.')
        },

        onError: () => {
            toast('Algo deu errado, tente novamente.')
        },
    })

    function handleEditTable(table: TEditTable) {
        // mandar o request pra editar a tabela

        editTableMutation.mutate({
            newData: {
                ...table,
            },
        })
    }

    return (
        <Sheet
            open={isEditing}
            onOpenChange={(isOpen) => {
                isOpen ? null : form.reset()
                setIsEditing(isOpen)
            }}
        >
            <SheetTrigger asChild>
                <Button
                    variant={'outline'}
                    size={'icon'}
                    className="cursor-pointer"
                >
                    <Pencil />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-xl">
                        Editar tabela{' '}
                        <u className="underline-offset-2">{currentCaption}</u>
                    </SheetTitle>
                    <SheetDescription>
                        Editar informações da tabela Clique em Salvar para
                        confirmar.
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleEditTable)}>
                        <div className="grid gap-4 px-4">
                            <FormField
                                control={form.control}
                                name="caption"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-md">
                                            Nome
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nome"
                                                maxLength={30}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <SheetFooter>
                            <Button type="submit">Salvar</Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
