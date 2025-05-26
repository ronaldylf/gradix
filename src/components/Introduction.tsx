import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

function Introduction() {
    return (
        <div className="w-md">
            <Accordion type="multiple" className="w-max">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-2xl cursor-pointer">
                        Como interpretar o horário?
                    </AccordionTrigger>
                    <AccordionContent>
                        <img
                            src="/comoInterpretarHorario.jpeg"
                            alt="Imagem do como interpretar seu horário."
                            className="w-sm"
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-2xl cursor-pointer">
                        Quantos horários têm em cada turno?
                    </AccordionTrigger>
                    <AccordionContent>
                        <img
                            src="/horariosDoDia.jpeg"
                            alt="Imagem dos horários do dia."
                            className="w-sm"
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default Introduction
