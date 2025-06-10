import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { XIcon } from 'lucide-react'

export default function CloseTable() {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <Button
            size={'icon'}
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
                router.push(pathname)
            }}
        >
            <XIcon />
        </Button>
    )
}
