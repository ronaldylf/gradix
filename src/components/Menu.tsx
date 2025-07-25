'use client'

import { HouseIcon, UserIcon } from 'lucide-react'
import { Button } from './ui/button'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Menu({ className }: { className: string }) {
    const { data: session } = useSession()
    const user = session?.user

    return (
        <div className={className}>
            {/* left side */}
            <div className="flex gap-3 items-center">
                <Link href="/">
                    <Button className="cursor-pointer">
                        <HouseIcon size={32} />
                    </Button>
                </Link>

                <div className="self-end text-2xl">{user?.name}</div>
            </div>

            {/* right side */}
            <div className="flex gap-2">
                <Link href={'/profile'}>
                    <Button
                        size={'icon'}
                        variant={'outline'}
                        className="cursor-pointer"
                    >
                        <UserIcon />
                    </Button>
                </Link>

                {/* <Button
                    size={'icon'}
                    variant={'outline'}
                    className="flex cursor-pointer"
                >
                    <SettingsIcon className="cursor-pointer" />
                </Button> */}
            </div>
        </div>
    )
}
