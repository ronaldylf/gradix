'use client'

import { IQueryTable } from '@/interfaces/IQueryTables'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { ChevronLeftIcon, PlusIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export default function TableSelection({
    tables,
    currentTableId,
    setIsCreatingTable,
}: {
    tables: IQueryTable[]
    currentTableId: string | null
    setIsCreatingTable: any
}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTables, setSelectedTables] = useState<string[]>([])
    const [isExporting, setIsExporting] = useState(false)

    const pathname = usePathname()
    const router = useRouter()

    if (!tables) return

    const filteredTables = tables.filter((table) =>
        table.caption.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const toggleTableSelection = (tableId: string, event: any) => {
        event.stopPropagation()
        setSelectedTables((prev: any) =>
            prev.includes(tableId)
                ? prev.filter((id: string) => id !== tableId)
                : [...prev, tableId]
        )
    }

    const openTable = (tableId: string) => {
        if (tableId === currentTableId) {
            router.push(pathname)
            return
        }
        router.push(`${pathname}?table=${tableId}`)
    }

    const handleExport = async () => {
        if (selectedTables.length === 0) {
            alert('Selecione pelo menos uma tabela para exportar.')
            return
        }

        setIsExporting(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const selectedTableNames = tables
            .filter((table) => selectedTables.includes(table.id))
            .map((table) => table.caption)

        alert(`Exportando: ${selectedTableNames.join(', ')}`)
        setIsExporting(false)
    }

    return (
        <div className="w-max">
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">Grades</CardTitle>
                        <div>
                            {/* <div className="flex flex-col items-center">
                                <Button
                                    onClick={handleExport}
                                    disabled={
                                        selectedTables.length === 0 ||
                                        isExporting
                                    }
                                    size="sm"
                                >
                                    {isExporting ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            Exportando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-file-pdf mr-2"></i>
                                            Exportar PDF
                                        </>
                                    )}
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {selectedTables.length} selecionadas
                                </span>
                            </div> */}
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="mb-2">
                        {/* Criar tabela */}
                        <Button
                            variant={'secondary'}
                            className="cursor-pointer w-full text-md justify-between"
                            onClick={() => {
                                setIsCreatingTable(true)
                            }}
                        >
                            Criar tabela
                            <PlusIcon />
                        </Button>
                    </div>

                    {/* Campo de pesquisa */}
                    <div className="relative mb-4">
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"></i>
                        <Input
                            placeholder="Pesquisar tabelas..."
                            value={searchTerm}
                            onChange={(e: any) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Lista de tabelas */}
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {filteredTables.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <i className="fas fa-table text-2xl mb-2"></i>
                                <p className="text-sm">
                                    Nenhuma tabela encontrada
                                </p>
                            </div>
                        ) : (
                            filteredTables.map((table) => (
                                <div
                                    key={table.id}
                                    className="flex items-center space-x-3 p-3 rounded-lg border border-foreground hover:cursor-pointer transition-colors"
                                    onClick={() => openTable(table.id)}
                                >
                                    {/* <input
                                        type="checkbox"
                                        checked={selectedTables.includes(
                                            table.id
                                        )}
                                        onChange={(e) =>
                                            toggleTableSelection(table.id, e)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-600 focus:ring-offset-0"
                                    /> */}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium truncate">
                                                {currentTableId === table.id ? (
                                                    <div className="flex">
                                                        {`${table.caption}`}
                                                        <ChevronLeftIcon />
                                                    </div>
                                                ) : (
                                                    <p>{table.caption}</p>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer com ações rápidas */}
                    {selectedTables.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedTables([])}
                                >
                                    Limpar seleção
                                </Button>
                                <div className="flex flex-wrap gap-1">
                                    {tables
                                        .filter((table) =>
                                            selectedTables.includes(table.id)
                                        )
                                        .slice(0, 3)
                                        .map((table) => (
                                            <Badge key={table.id}>
                                                {table.caption}
                                            </Badge>
                                        ))}
                                    {selectedTables.length > 3 && (
                                        <Badge variant="secondary">
                                            +{selectedTables.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
