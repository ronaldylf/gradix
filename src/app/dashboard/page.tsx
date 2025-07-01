'use client'

import AddChairSheet from '@/components/add-chair-sheet'
import Amount from '@/components/Amount'
import CreateTableDialog from '@/components/CreateTableDialog'
import MainTable from '@/components/MainTable'
import Menu from '@/components/Menu'
import SelectTable from '@/components/select-table'
import TableOptions from '@/components/table-options'
import { ITimeTable } from '@/interfaces/ITimeTable'
import { getChairs } from '@/requests/chairs'
import { getTable, getUserTables } from '@/requests/tables'
import { getDefaultCaption } from '@/utils/DefaultTable'
import { generateMatrixFormat } from '@/utils/generateMatrixFormat'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export default function Dashboard() {
    const printTableRef = useRef<any>(null)
    const searchParams = useSearchParams()

    const pairs = [...searchParams]
    const tableId = pairs[0] && pairs[0][0] === 'table' ? pairs[0][1] : null

    const { data: session } = useSession()
    const user = session?.user
    const userId = user?.id

    const queryClient = useQueryClient()

    const queryCurrentTable = useQuery({
        queryKey: ['mainTable'],
        queryFn: async () => {
            return await getTable(userId || '', tableId || '')
        },
        enabled: !!userId,
    })

    const queryChairs = useQuery({
        queryKey: ['tableChairs'],
        queryFn: async () => {
            return await getChairs(userId || '', tableId || '')
        },
        enabled: !!userId,
    })

    const queryTables = useQuery({
        queryKey: ['userTables'],
        queryFn: async () => {
            return await getUserTables(userId || '')
        },
        enabled: !!userId,
    })

    // if (queryCurrentTable.isLoading) return <div>Carregando...</div>
    // if (queryCurrentTable.isError)
    //     return <div>Erro: {queryCurrentTable.error.message}</div>

    // if (queryChairs.isLoading) return <div>Carregando...</div>
    // if (queryChairs.isError) return <div>Erro: {queryChairs.error.message}</div>

    const [isCreatingTable, setIsCreatingTable] = useState(false)

    const [timeTable, setTimeTable] = useState<ITimeTable>({
        data: generateMatrixFormat(queryChairs.data),
        caption: getDefaultCaption(),
    })

    useLayoutEffect(() => {
        setTimeTable({
            ...timeTable,
            data: generateMatrixFormat(queryChairs.data),
        })
    }, [queryChairs.data])

    useLayoutEffect(() => {
        const caption = queryCurrentTable.data?.caption

        if (caption) {
            setTimeTable((oldTimeTable) => {
                return { ...oldTimeTable, caption }
            })
        }
    }, [queryCurrentTable.data])

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['mainTable'] })
        queryClient.invalidateQueries({ queryKey: ['tableChairs'] })
    }, [tableId])

    if (!session) return

    return (
        <div>
            <div className="flex flex-col w-full px-2">
                <Menu className="flex place-items-end self-baseline justify-between border-b pb-2 w-full my-5 md:px-2" />

                <div className="flex flex-col justify-around gap-5">
                    <SelectTable
                        tables={queryTables.data}
                        currentTableId={tableId}
                    />

                    <CreateTableDialog
                        open={isCreatingTable}
                        onOpenChange={setIsCreatingTable}
                        userId={userId}
                    />

                    {tableId ? (
                        <div className="flex flex-col gap-4 font-sans">
                            <AddChairSheet
                                table={timeTable}
                                tableId={queryCurrentTable.data?.id}
                            />

                            {tableId ? (
                                <TableOptions
                                    userId={userId || ''}
                                    tableId={tableId || ''}
                                    timeTable={timeTable}
                                    printRef={printTableRef}
                                />
                            ) : null}

                            <div
                                ref={printTableRef}
                                className="space-y-2 bg-background text-foreground"
                            >
                                <Amount
                                    timeTable={timeTable}
                                    className="flex gap-2 text-xl rounded-sm border-2 p-3 w-full justify-center"
                                />
                                <MainTable
                                    tableId={tableId}
                                    timeTable={timeTable}
                                />
                            </div>
                        </div>
                    ) : (
                        <h1>Sem tabela selecionada</h1>
                    )}

                    {/* Line */}
                    <div className="border"></div>
                </div>
            </div>
        </div>
    )
}
