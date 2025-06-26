'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { IQueryTable } from '@/interfaces/IQueryTables'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SelectTable({
    tables,
    currentTableId,
    className,
}: {
    tables: IQueryTable[]
    currentTableId: string | null
    className?: string
}) {
    const [open, setOpen] = useState(false)

    const pathname = usePathname()
    const router = useRouter()

    if (!tables) return

    function openTable(selectedTableId: string) {
        setOpen(false)

        if (selectedTableId === currentTableId) {
            return
        }
        router.push(`${pathname}?table=${selectedTableId}`)
    }

    return (
        <div className={className}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        Selecionar grade de horários
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-max p-0">
                    <Command>
                        <CommandInput
                            placeholder="Pesquisar grade..."
                            className="h-9"
                        />
                        <CommandList>
                            <CommandEmpty>
                                Nenhuma tabela encontrada.
                            </CommandEmpty>
                            <CommandGroup>
                                {tables.map((table) => (
                                    <CommandItem
                                        key={table.id}
                                        value={table.caption}
                                        onSelect={() => {
                                            openTable(table.id)
                                        }}
                                    >
                                        {table.caption}
                                        <Check
                                            className={cn(
                                                'ml-auto',
                                                table.id === currentTableId
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
