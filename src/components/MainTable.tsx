import React, { useEffect, useMemo, useState } from "react";
import { TimeTableContext } from "../utils/TimeTableContext";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getRowTime } from "@/utils/GetRowTime";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ITimeSlot } from "@/interfaces/ITimeSlot";
import defaultSlot from "@/utils/DefaultSlot";
import { toast } from "sonner";

function MainTable() {
    const tableContext = React.useContext(TimeTableContext) 

    const [ timeTable, setTimeTable ] = tableContext.timeTable

    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false);

    const [ currentLabel, setCurrentLabel ] = useState("")

    const [ tableData, setTableData ] = useState(matrixToObject(timeTable.data))

    function handleDeleteDialog(label: string) {
        setCurrentLabel(label)
        setShowDeleteDialog(true)
    }

    function deleteChair() {
        setTimeTable((prev) => {
            const newData = prev.data.map((row) => {
                return row.map((slot) => {
                    // Verifique se o slot e o childChair estão definidos
                    if (slot && slot.childChair && slot.childChair.label === currentLabel) {
                        // Retorna o slot padrão (ou um valor que represente a remoção)
                        return defaultSlot;
                    }
                    return slot;
                });
            }
            );
    
            return { ...prev, data: newData };
        })

        toast(`Cadeira ${currentLabel} excluida.`)
    }

    function matrixToObject(matrix: ITimeSlot[][]) {
        return matrix.map((row_items, row) => {
            return {
                'horario': getRowTime(`H${row+1}`),
                'dia2': row_items[0].childChair.label,
                'dia3': row_items[1].childChair.label,
                'dia4': row_items[2].childChair.label,
                'dia5': row_items[3].childChair.label,
                'dia6': row_items[4].childChair.label,
            }
        });
    }

    const columns = useMemo(() => [
        {
            header: 'Horário',
            accessorKey: 'horario',
        },
        {
            header: 'Segunda',
            accessorKey: 'dia2'
        },
        {
            header: 'Terça',
            accessorKey: 'dia3'
        },
        {
            header: 'Quarta',
            accessorKey: 'dia4'
        },
        {
            header: 'Quinta',
            accessorKey: 'dia5'
        },
        {
            header: 'Sexta',
            accessorKey: 'dia6',
        },
    ], [])


    useEffect(() => {
        setTableData(matrixToObject(timeTable.data))
    }, [timeTable])

    const mainTable = useReactTable({
        columns,
        data: tableData,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <div>
            <Table className="
            text-center
            ">
                <TableCaption>{ timeTable.caption }</TableCaption>

                <TableHeader>
                    {mainTable.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={ header.id } className="text-center w-[100px]">
                                    { String(header.column.columnDef.header) }
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody> 
                    { mainTable.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            { Object.values(row.original).map((name, idx_col) => (
                                <TableCell onClick={
                                    (name !== "" && idx_col !== 0) ? (() => {
                                        handleDeleteDialog(name);
                                    }) : (() => {})
                                } className={
                                    `
                                ${(name!=='') ? 'hover:bg-red-500/70' : ''}
                                align-middle
                                cursor-pointer
                                `
                                } key={idx_col}>
                                    { name }
                                </TableCell>
                            )) }
                        </TableRow>
                    )) }
                </TableBody>

                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex gap-1">Excluir cadeira <div className="underline">{ currentLabel }</div>?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Essa ação irá excluir a cadeira da grade de horários.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500 hover:bg-red-500/50 cursor-pointer text-primary" onClick={deleteChair}>Sim, excluir</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Table>
        </div>
    )
}

export default MainTable;