import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'

export default function TableSelection({ tables, currentTableId }: any) {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div className="flex flex-col gap-2">
            {tables &&
                tables.map((table: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-0.5">
                        <Button
                            variant={'outline'}
                            className={
                                'text-md w-full cursor-pointer justify-between' +
                                ' ' +
                                (table.id === currentTableId
                                    ? 'shadow-sm shadow-foreground'
                                    : '')
                            }
                            onClick={() => {
                                if (table.id === currentTableId) {
                                    router.push(pathname)
                                    return
                                }
                                router.push(`${pathname}?table=${table.id}`)
                            }}
                        >
                            <p>{table.caption}</p>
                        </Button>
                    </div>
                ))}
        </div>
    )
}
