import { Download } from 'lucide-react'
import { Button } from './ui/button'

export default function DownloadTable() {
    return (
        <Button variant={'outline'} size={'icon'} className="cursor-pointer">
            <Download />
        </Button>
    )
}
