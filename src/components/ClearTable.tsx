'use client'

import { RefreshCcw } from 'lucide-react'
import { Button } from './ui/button'
import React from 'react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clearTable } from '@/requests/tables'

function ClearTable({ userId, tableId }: { userId: string; tableId: string }) {
    const queryClient = useQueryClient()

    const clearTableMutation = useMutation({
        mutationFn: async () => {
            return await clearTable(userId, tableId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tableChairs'] })
            toast('Grade limpa com sucesso.')
        },
        onError: () => {
            toast('Algo deu errado ao limpar a grade. Tente novamente.')
        },
    })

    return (
        // add a tooltip later
        <Button
            size={'icon'}
            className="cursor-pointer"
            onClick={() => {
                clearTableMutation.mutate()
            }}
        >
            <RefreshCcw />
        </Button>
    )
}

export default ClearTable
