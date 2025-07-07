import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { BookPlusIcon } from 'lucide-react'
import AddChairForm from './add-chair-form'
import { ITimeTable } from '@/interfaces/ITimeTable'
import { useState } from 'react'

export default function AddChairSheet({
    table,
    tableId,
}: {
    table: ITimeTable
    tableId: string
}) {
    const [showSheet, setShowSheet] = useState(false)

    return (
        <Sheet open={showSheet} onOpenChange={(isOpen) => setShowSheet(isOpen)}>
            <SheetTrigger asChild>
                <Button variant="outline" className="cursor-pointer text-lg">
                    Adicionar cadeira <BookPlusIcon />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Adicionar cadeira</SheetTitle>
                    <SheetDescription>
                        Escolha um nome, adicione o código de horário, e
                        selecione se é optativa ou obrigatória.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    <SheetClose asChild>
                        <AddChairForm
                            table={table}
                            tableId={tableId}
                            onSuccess={setShowSheet}
                        />
                        {/* <Button type="submit">Save changes</Button> */}
                    </SheetClose>
                    {/* <SheetFooter>
                        
                    </SheetFooter> */}
                </div>
            </SheetContent>
        </Sheet>
    )
}
