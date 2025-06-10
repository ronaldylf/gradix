import { TrashIcon } from 'lucide-react'
import { Button, buttonVariants } from './ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTable } from '@/requests/tables'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'

export default function DeleteTable({
    userId,
    tableId,
    caption,
}: {
    userId: string
    tableId: string
    caption: string
}) {
    const queryClient = useQueryClient()
    const router = useRouter()
    const pathname = usePathname()

    const deleteTableMutation = useMutation({
        mutationFn: async () => {
            return await deleteTable(userId, tableId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userTables'] })
            toast('Tabela excluida com sucesso.')
            router.push(pathname)
        },
    })

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant={'outline'} className="cursor-pointer">
                        <TrashIcon />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Excluir tabela <u>{caption}</u> ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação irá apagar a tabela e todas as cadeiras
                            nela contidas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                deleteTableMutation.mutate()
                            }}
                            className={buttonVariants({
                                variant: 'destructive',
                            })}
                        >
                            Excluir <TrashIcon />
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
