'use client'

import { GithubIcon, MailIcon } from 'lucide-react'
import { Button } from './ui/button'
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

    return (
        <div className={cn('flex gap-2', className)}>
            <a type="email" target="_blank" href="mailto:ronaldylf2@gmail.com">
                <Button variant={button_variant} className="cursor-pointer">
                    <MailIcon />
                </Button>
            </a>

            <a target="_blank" href="https://github.com/ronaldylf/">
                <Button variant={button_variant} className="cursor-pointer">
                    <GithubIcon />
                </Button>
            </a>
        </div>
    )
}
