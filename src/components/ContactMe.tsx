'use client'

import { CircleHelp, Coffee, Github, Handshake, Mail } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip'
import { Avatar, AvatarImage } from './ui/avatar'
import { Checkbox } from './ui/checkbox'
import { cn } from '@/lib/utils'

export default function ContactMe({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const button_variant:
        | 'link'
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost' = 'outline'

    const options = ['1', '2', '3']
    const priceCoffe = 5
    const [coffes, setCoffes] = useState(options[0])

    const amountPrice = Number(coffes) * priceCoffe

    function getCorrectPixURL() {
        if (amountPrice === 5) {
            return process.env.coffeLinkLow
        } else if (amountPrice === 10) {
            return process.env.coffeLinkMedium
        } else if (amountPrice === 15) {
            return process.env.coffeLinkHigh
        }

        return process.env.coffeLinkCustom
    }

    return (
        <div className={cn('flex gap-2', className)}>
            <a type="email" target="_blank" href="mailto:ronaldylf2@gmail.com">
                <Button variant={button_variant} className="cursor-pointer">
                    <Mail />
                </Button>
            </a>

            <a target="_blank" href="https://github.com/ronaldylf/">
                <Button variant={button_variant} className="cursor-pointer">
                    <Github />
                </Button>
            </a>

            <Dialog onOpenChange={() => setCoffes(options[0])}>
                <DialogTrigger asChild>
                    <Button
                        variant={button_variant}
                        className="flex gap-2 cursor-pointer"
                    >
                        <Coffee />
                        Me pague um café ;)
                    </Button>
                </DialogTrigger>
                <DialogContent className="min-w-max w-lg">
                    <DialogTitle>Sobre mim</DialogTitle>

                    <TooltipProvider>
                        <div className="flex gap-4 py-4">
                            {/* fala um pouco sobre o criador + foto */}
                            <div className="flex flex-col gap-2 w-sm">
                                <div className="flex gap-2 place-items-baseline">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src="ronaldy.jpeg" />
                                    </Avatar>
                                    <h1 className="underline underline-offset-8">
                                        Ronaldy Lima
                                    </h1>
                                </div>
                                <div>
                                    {' '}
                                    Transformo café em código, e código em
                                    soluções que facilitam o dia a dia. Se essa
                                    ferramenta lhe ajudou, pode me pagar um
                                    cafézinho :-){' '}
                                </div>
                            </div>

                            {/* lado direito */}
                            <div className="flex flex-col gap-3 max-w-xs">
                                <Tooltip>
                                    <div className="w-max flex gap-2 place-items-baseline">
                                        Me pague um café
                                        <TooltipTrigger>
                                            <CircleHelp className="cursor-pointer" />
                                        </TooltipTrigger>
                                    </div>
                                    <TooltipContent>
                                        <p className="w-max">
                                            É uma metáfora amigável, não café de
                                            verdade.
                                            <br />
                                            Cada "café" custa{' '}
                                            {`${priceCoffe.toLocaleString('pt-BR', { style: 'currency', currency: 'brl' })}`}{' '}
                                            e você pode comprar <br />
                                            quantos quiser.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>

                                {/* selecionar quantos cafés */}
                                <div>
                                    {/* número de cafés */}
                                    <div className="flex gap-2 text-lg items-center py-3">
                                        <div className="text-5xl">☕</div>

                                        {options.map((option, idx) => {
                                            let className =
                                                'rounded-full text-lg cursor-pointer'
                                            if (option !== coffes) {
                                                className +=
                                                    ' text-primary bg-primary-foreground hover:bg-primary-foreground/70'
                                            }
                                            return (
                                                <Button
                                                    key={idx}
                                                    className={className}
                                                    onClick={() => {
                                                        setCoffes(option)
                                                    }}
                                                >
                                                    {option}
                                                </Button>
                                            )
                                        })}

                                        <div className="flex items-center space-x-2 cursor-pointer">
                                            <Checkbox
                                                id="terms"
                                                className="cursor-pointer"
                                                checked={coffes === '-1'}
                                                onCheckedChange={(checked) => {
                                                    checked
                                                        ? setCoffes('-1')
                                                        : setCoffes(options[0])
                                                }}
                                            />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                Personalizar
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* dizer algumas palavras */}
                                <p className="border border-solid rounded-md px-1 py-1 items">
                                    Aproveita e deixa uma mensagem no Pix! Vai
                                    ser um prazer ler. <Handshake />{' '}
                                </p>

                                <a
                                    className="w-full"
                                    target="_blank"
                                    href={getCorrectPixURL()}
                                >
                                    <Button className="w-full rounded-full cursor-pointer">
                                        {coffes !== '-1'
                                            ? `Apoie com ${amountPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'brl' })}`
                                            : 'Apoie com o que puder :)'}
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </TooltipProvider>
                    <DialogFooter>{/* Something in Footer */}</DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
