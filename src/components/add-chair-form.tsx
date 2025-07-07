'use client'

import { validateTimeCode } from '../utils/ValidateChairCode'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { CirclePlusIcon } from 'lucide-react'
import { Switch } from './ui/switch'
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
import { toast } from 'sonner'
import { getConflictingChair } from '@/utils/chairFitsInTable'
import { ITimeTable } from '@/interfaces/ITimeTable'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createChair } from '@/requests/chairs'
import { IChair } from '@/interfaces/IChair'

const addChairSchema = z
    .object({
        timeCode: z.string().nonempty().min(3).max(10),
        label: z.string().nonempty().min(2).max(20),
        isRequired: z.boolean(),
    })
    .refine(validateTimeCode, {
        message: 'Horário inválido',
        path: ['timeCode'],
    })

type TAddChair = z.infer<typeof addChairSchema>

export default function AddChairForm({
    table,
    tableId,
    onSuccess,
}: {
    table: ITimeTable
    tableId: string
    onSuccess: any
}) {
    const form = useForm<TAddChair>({
        resolver: zodResolver(addChairSchema),
        defaultValues: {
            label: '',
            timeCode: '',
            isRequired: true,
        },
    })

    const queryClient = useQueryClient()

    const createChairMutation = useMutation({
        mutationFn: async ({ chair }: { chair: IChair }) => {
            return await createChair(chair)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tableChairs'] })
            toast(
                `Cadeira adicionada: ${data.label} (${data.isRequired ? 'Obrigatória' : 'Optativa'})`,
                {
                    description:
                        'Para editar ou excluir, clique em cima da cadeira na grade.',
                    action: {
                        label: 'Undo',
                        onClick: () => console.log('Undo'),
                    },
                }
            )
            onSuccess(false)
        },
        onError: () => {
            toast('Algo deu errado ao adicionar a cadeira, tente novamente.')
        },
    })

    function handleChairAddition(chair: TAddChair) {
        // Verificar se não há conflito de horários
        const conflictChair = getConflictingChair({
            chair,
            currentTable: table,
        })

        if (conflictChair) {
            // não faz nada pois já existe X cadeira no lugar
            toast(`Conflito de horários com a cadeira ${conflictChair.label}`)
            return
        }

        createChairMutation.mutate({
            chair: {
                ...chair,
                tableId,
            },
        })

        form.reset()
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleChairAddition)}
                className="px-4"
            >
                <div className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-md">Nome</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nome"
                                        maxLength={20}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="timeCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-md">
                                    Horário
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Horário"
                                        maxLength={10}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="mt-2">
                        <FormField
                            control={form.control}
                            name="isRequired"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-5">
                                            <FormLabel>Obrigatória</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    defaultChecked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                    className="scale-x-[-1] relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ease-in-out [&>span]:h-6 [&>span]:w-6 [&>span]:rounded-full [&>span]:bg-white [&>span]:transition-transform [&>span]:duration-200 [&>span]:ease-in-out data-[state=checked]>span:translate-x-6 cursor-pointer"
                                                />
                                            </FormControl>
                                            <FormLabel>Optativa</FormLabel>
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="shadow">
                        Adicionar
                        <CirclePlusIcon />
                    </Button>
                </div>
            </form>
        </Form>
    )
}
