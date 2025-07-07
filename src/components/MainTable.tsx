'use client'

import { ITimeSlot } from '@/interfaces/ITimeSlot'
import { toast } from 'sonner'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table'
import { Input } from './ui/input'
import { matrixToObject } from '@/utils/matrixToObject'
import { getDefaultData } from '@/utils/DefaultTable'
import { ITimeTable } from '@/interfaces/ITimeTable'
import { isDefaultSlot } from '@/utils/DefaultSlot'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { TrashIcon } from 'lucide-react'
import { deleteChair, editChair } from '@/requests/chairs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Checkbox } from './ui/checkbox'
import { getRowRangeDate } from '@/utils/getRowRangeDate'

export default function MainTable({ timeTable }: { timeTable: ITimeTable }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [slotSelected, setSlotSelected] = useState<ITimeSlot | null>(null)

    const today = new Date()
    const currentDay = today.getDay()
    const initWeekDay = [0, 6].includes(currentDay) ? 2 : currentDay + 1 // monday=2, tuesday=3, ...
    const [weekDay, setWeekDay] = useState(initWeekDay)

    const weekDays = [
        { id: 2, name: 'S' },
        { id: 3, name: 'T' },
        { id: 4, name: 'Q' },
        { id: 5, name: 'Q' },
        { id: 6, name: 'S' },
    ]

    const columns = useMemo(
        () => [
            {
                header: 'Horário',
                accessorKey: 'horario',
            },
            {
                header: 'Segunda',
                accessorKey: 'dia2.childChair.label',
            },
            {
                header: 'Terça',
                accessorKey: 'dia3.childChair.label',
            },
            {
                header: 'Quarta',
                accessorKey: 'dia4.childChair.label',
            },
            {
                header: 'Quinta',
                accessorKey: 'dia5.childChair.label',
            },
            {
                header: 'Sexta',
                accessorKey: 'dia6.childChair.label',
            },
        ],
        []
    )

    const [objectData, setObjectData] = useState(
        matrixToObject(getDefaultData())
    )

    useEffect(() => {
        setObjectData(matrixToObject(timeTable.data))
    }, [timeTable.data])

    const mainTable = useReactTable({
        columns,
        data: objectData,
        getCoreRowModel: getCoreRowModel(),
    })

    const queryClient = useQueryClient()

    const editChairMutation = useMutation({
        mutationFn: async ({
            chairId,
            data,
        }: {
            chairId: string
            data: any
        }) => {
            return await editChair(chairId, {
                ...data,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tableChairs'] })
            toast('Cadeira editada com sucesso.')
        },
        onError: () => {
            toast('Algo deu errado, tente novamente.')
        },
    })

    const deleteChairMutation = useMutation({
        mutationFn: async ({ chairId }: { chairId: string }) => {
            return await deleteChair(chairId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tableChairs'] })
            toast(`${slotSelected?.childChair.label} excluída com sucesso.`)
        },
        onError: () => {
            toast('Algo deu errado, tente novamente.')
        },
    })

    function handleChairClick(slot: ITimeSlot) {
        setSlotSelected({ ...slot })
        setShowDeleteDialog(true)
    }

    async function handleEditChair(formData: any) {
        const editedChairName = formData.get('editedChairName')
        const editedIsRequired = formData.get('isRequired') ? true : false

        interface IEditedData {
            label?: string
            isRequired?: boolean
        }

        const editedData: IEditedData = {
            label: editedChairName,
            isRequired: editedIsRequired,
        }

        if (editedChairName === slotSelected?.childChair.label) {
            // didnt edit label
            delete editedData.label
        }

        if (editedIsRequired === slotSelected?.childChair.isRequired) {
            // didnt edit isRequired
            delete editedData.isRequired
        }

        if (Object.keys(editedData).length === 0) {
            // didnt edit anything
            // so it's not necessary to send any request
            toast('Não editou nada.')
            return
        }

        editChairMutation.mutate({
            chairId: slotSelected?.childChair.id || '',
            data: editedData,
        })
    }

    function handleDeleteChair() {
        deleteChairMutation.mutate({
            chairId: slotSelected?.childChair.id || '',
        })
    }

    interface previousRowI {
        values: Array<string | ITimeSlot>
        original: any
    }

    const previousRow: previousRowI = {
        values: [],
        original: {},
    }

    return (
        <div>
            <h1 className="caption-top border rounded-sm p-1 text-primary text-2xl mt-0 mb-2 justify-center text-center">
                {timeTable.caption}
            </h1>

            <div className="md:hidden">
                <div className="flex justify-between">
                    {weekDays.map((day) => (
                        <Button
                            variant={'secondary'}
                            key={day.id}
                            onClick={() => setWeekDay(day.id)}
                            className={` flex-1 py-2 text-sm font-medium ${
                                weekDay === day.id
                                    ? 'bg-foreground text-accent hover:bg-foreground/90'
                                    : ''
                            }`}
                        >
                            {day.name}
                        </Button>
                    ))}
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    {mainTable.getRowModel().rows.map((row) => {
                        const values = Object.values(row.original).map(
                            (slot, idx_col) => {
                                if (typeof slot === 'string') return

                                // M1, T2, N3, ...
                                if (slot.col + 2 === weekDay) {
                                    const previousSlot =
                                        previousRow.values[idx_col]
                                    if (
                                        typeof previousSlot !== 'string' &&
                                        previousSlot.childChair.id !==
                                            slot.childChair.id
                                    )
                                        return

                                    const rangeStart = getRowRangeDate(
                                        previousRow.original.horario
                                    )

                                    const rangeEnd = getRowRangeDate(
                                        row.original.horario
                                    )

                                    const formattedStart = rangeStart.start
                                        .toLocaleTimeString('pt-BR')
                                        .substring(0, 5)
                                    const formattedEnd = rangeEnd.end
                                        .toLocaleTimeString('pt-BR')
                                        .substring(0, 5)

                                    return (
                                        <Button
                                            key={row.id}
                                            variant={'outline'}
                                            onClick={() => {
                                                handleChairClick({
                                                    ...slot,
                                                })
                                            }}
                                            className="p-6"
                                        >
                                            <h1>
                                                {slot.childChair.label}
                                                <br />
                                                {formattedStart} -{' '}
                                                {formattedEnd}
                                            </h1>
                                        </Button>
                                    )
                                }
                            }
                        )
                        previousRow.original = row.original
                        previousRow.values = Object.values(row.original).map(
                            (v) => v
                        )
                        return values
                    })}
                </div>
            </div>

            <Table className="hidden text-center md:table">
                <TableHeader>
                    {mainTable.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            className="bg-accent/50 hover:bg-accent/50"
                            key={headerGroup.id}
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="text-center"
                                >
                                    {String(header.column.columnDef.header)}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {mainTable.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {Object.values(row.original).map(
                                (slot, idx_col) => {
                                    const rangeTime = getRowRangeDate(
                                        row.original.horario
                                    )

                                    const formattedStart = rangeTime.start
                                        .toLocaleTimeString('pt-BR')
                                        .substring(0, 5)
                                    const formattedEnd = rangeTime.end
                                        .toLocaleTimeString('pt-BR')
                                        .substring(0, 5)

                                    return (
                                        <TableCell
                                            onClick={
                                                typeof slot !== 'string' &&
                                                !isDefaultSlot(slot)
                                                    ? () =>
                                                          handleChairClick({
                                                              ...slot,
                                                          })
                                                    : () => {}
                                            }
                                            className={`
                                        ${typeof slot !== 'string' && !isDefaultSlot(slot) ? 'hover:bg-red-500/70' : ''}
                                        align-middle
                                        cursor-pointer
                                        `}
                                            key={idx_col}
                                        >
                                            {typeof slot === 'string'
                                                ? `${formattedStart} - ${formattedEnd}`
                                                : slot.childChair.label}
                                        </TableCell>
                                    )
                                }
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex">
                            Editar cadeira &nbsp;
                            <p className="underline">
                                {slotSelected?.childChair.label}
                            </p>
                        </DialogTitle>
                        <DialogDescription>
                            Essa ação irá editar ou excluir a cadeira da grade.
                        </DialogDescription>
                    </DialogHeader>

                    <form action={handleEditChair}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="editedChairName"
                                    className="text-right"
                                >
                                    Nome
                                </Label>
                                <Input
                                    name="editedChairName"
                                    id="editedChairName"
                                    defaultValue={
                                        slotSelected?.childChair.label
                                    }
                                    className="col-span-3"
                                />
                                {/* Add a edit isRequired */}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    name="isRequired"
                                    id="isRequired"
                                    defaultChecked={
                                        slotSelected?.childChair.isRequired
                                    }
                                />
                                <label
                                    htmlFor="isRequired"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Obrigatória
                                </label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                onClick={() => {
                                    setShowDeleteDialog(false)
                                }}
                                className="cursor-pointer"
                            >
                                Salvar
                            </Button>

                            <Button
                                variant={'secondary'}
                                onClick={() => {
                                    handleDeleteChair()
                                    setShowDeleteDialog(false)
                                }}
                                className="cursor-pointer"
                            >
                                <TrashIcon color="#FF0000" />
                                Excluir
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
