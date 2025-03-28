import React, { useState } from 'react';
import { TimeTableContext } from '../utils/TimeTableContext';
import { ValidadeChairCode } from '../utils/ValidateChairCode';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { CirclePlus } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import { IChair } from '@/interfaces/IChair';
import { Switch } from './ui/switch';
import defaultChair from '@/utils/DefaultChair';
import { toast } from 'sonner';
import { getDefaultCaption } from '@/utils/DefaultTable';


function InputChair() {
    const tableContext = React.useContext(TimeTableContext) 

    function handleChairAddition(chair: IChair) {
        const result = ValidadeChairCode(chair.code, chair.label);

        if (result instanceof Error) {
            return result
        }

        const { rows, columns } = result;

        const [timeTable, setTimeTable] = tableContext.timeTable;
        const editedTableData = [...timeTable.data];

        // veriicar se "cabe" na grade de horários
        const primeiraLinhaJaPreenchida = editedTableData.find((row, idx_row) => {
            return (idx_row >= rows[0] && idx_row <= rows[rows.length-1] && 
                row.filter(chair => chair.childChair.label!=='').length !== 0
            )
        })

        if (typeof primeiraLinhaJaPreenchida !== 'undefined') {
            const cadeiraJaPreenchida = primeiraLinhaJaPreenchida?.find((_, idx_col) => {
                return (idx_col >= columns[0] && idx_col <= columns[columns.length-1])
            })

            if (cadeiraJaPreenchida?.childChair.label !== '') {
                return Error(`Conflito de horários com a cadeira ${cadeiraJaPreenchida?.childChair.label}`)
            }
        }
        

        columns.map(col => {
            rows.map(row => {
                editedTableData[row][col] = {
                    childChair: chair,
                    row,
                    col
                }
            })
        })

        setTimeTable({
            data: editedTableData,
            caption: getDefaultCaption()
        })
    }

    const [ currentChair, setCurrentChair ] = useState(defaultChair)

    return (
        <div className='
        flex
        flex-col
        gap-5
        w-max
        p-5
        rounded-xl border
        text-card-foreground
        shadow
        '>
            <div className='
            w-sm
            text-2xl
            '>
                <div className='flex gap-3.5'>
                    <Label className='underline cursor-pointer' htmlFor="codigo-cadeira">Código:</Label>
                    <Input type='text' value={ currentChair.code } placeholder='Código' maxLength={7} id='codigo-cadeira' name='codigo-cadeira' onChange={
                        evt => setCurrentChair({...currentChair, code: evt.target.value})
                    }/>
                </div>
                
                <div className='flex gap-6'>
                    <Label className='underline cursor-pointer' htmlFor="nome-cadeira">Nome:</Label>
                    <Input type='text' value={ currentChair.label } placeholder='Nome' id='nome-cadeira' name='nome-cadeira' onChange={
                        evt => setCurrentChair({...currentChair, label: evt.target.value})
                    }/>
                </div>

            </div>
            
            <div className='flex gap-5 place-items-center place-self-end'>
                <div className='flex gap-5'>
                    <Label>Obrigatória</Label>

                    <Switch className="
                    relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ease-in-out 
                    [&>span]:h-6 [&>span]:w-6 [&>span]:rounded-full [&>span]:bg-white [&>span]:transition-transform [&>span]:duration-200 [&>span]:ease-in-out
                    data-[state=checked]>span:translate-x-6 cursor-pointer
                    "
                    checked={!currentChair.isRequired} onCheckedChange={() => {
                        setCurrentChair({...currentChair, isRequired: !currentChair.isRequired});
                    }}/>

                    <Label>Optativa</Label>

                </div>
                <Button size='lg' className='
                flex
                shadow
                cursor-pointer
                ' variant='outline' onClick={
                    () => {
                        const result = handleChairAddition(currentChair);
                        if (result instanceof Error) {
                            alert(result.message)
                        } else {
                            setCurrentChair(defaultChair) // limpa os inputs
                            toast(`Cadeira adicionada: ${currentChair.label} (${currentChair.isRequired ? 'Obrigatória' : 'Optativa'})`, {
                                description: "Para excluir, clique em cima da cadeira na grade.",
                                action: {
                                    label: "Undo",
                                    onClick: () => console.log("Undo"),
                                },
                            })
                        }
                    }
                }>
                    <CirclePlus/>
                    Adicionar
                </Button>
            </div>
        </div> 
    )
}

export default InputChair;