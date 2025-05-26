'use client'

import { House, Settings } from 'lucide-react'
import { Button } from './ui/button'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Menu() {
    const { data: session } = useSession()
    const user = session?.user

    return (
        <div
            className="
        flex
        place-items-end
        self-baseline
        justify-between
        border-b
        pb-2
        w-full
        my-5
        "
        >
            {/* left side */}
            <div className="flex gap-3 items-center">
                <Link href="/">
                    <Button className="cursor-pointer">
                        <House size={32} />
                    </Button>
                </Link>

                <div className="self-end text-2xl">{user?.name}</div>
            </div>

            {/* right side */}
            <div>
                <Button className="flex cursor-pointer">
                    <Settings className="cursor-pointer" />
                </Button>
            </div>
        </div>
    )
}
