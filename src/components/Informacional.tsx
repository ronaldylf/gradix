import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from './ui/accordion'

export default function Informacional() {
    return (
        <div className="w-md">
            <Accordion type="single" collapsible className="w-max">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-xl cursor-pointer">
                        Como interpretar o horário?
                    </AccordionTrigger>
                    <AccordionContent>
                        <img
                            src="comoInterpretarHorario.jpeg"
                            alt="Imagem do como interpretar o horário."
                            className="w-sm"
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-xl cursor-pointer">
                        Quais os horários de cada turno?
                    </AccordionTrigger>
                    <AccordionContent>
                        <img
                            src="horariosDoDia.jpeg"
                            alt="Imagem dos horários do dia."
                            className="w-sm"
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
