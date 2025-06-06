'use client'

import { ITimeSlot } from '@/interfaces/ITimeSlot'
import { toast } from 'sonner'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table'
import { Input } from './ui/input'
import { matrixToObject } from '@/utils/matrixToObject'
import { getDefaultCaption, getDefaultData } from '@/utils/DefaultTable'
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
import EditTable from './EditTable'

export default function MainTable({
    tableId,
    timeTable,
}: {
    tableId: string
    timeTable: ITimeTable
}) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [slotSelected, setSlotSelected] = useState<ITimeSlot | null>(null)

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

        let editedData: IEditedData = {
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
            // so it's not necessary to send request to api

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

    return (
        <div>
            <Table className="text-center caption-top">
                <TableCaption className="mb-3 text-primary text-2xl border rounded-sm p-1">
                    <div className="flex gap-2 items-center justify-center">
                        <h1> {timeTable.caption}</h1>

                        {/* Prevents default state value */}
                        {timeTable.caption === getDefaultCaption() ? null : (
                            <EditTable
                                tableId={tableId}
                                currentCaption={timeTable.caption || ''}
                            />
                        )}
                    </div>
                </TableCaption>

                <TableHeader>
                    {mainTable.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            className="bg-accent/50 hover:bg-accent/50"
                            key={headerGroup.id}
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="text-center text-primary w-[100px]"
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
                                (slot, idx_col) => (
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
                                            ? slot
                                            : slot.childChair.label}
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    ))}
                </TableBody>

                <Dialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex">
                                Editar cadeira &nbsp;
                                <p className="underline">
                                    {slotSelected?.childChair.label}
                                </p>
                            </DialogTitle>
                            <DialogDescription>
                                Essa ação irá editar ou excluir a cadeira da
                                grade.
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
            </Table>
        </div>
    )
}
