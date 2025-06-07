import { DownloadIcon } from 'lucide-react'
import { Button } from './ui/button'
import { RefObject } from 'react'
import html2canvas from 'html2canvas-pro'

export default function DownloadTable({
    printRef,
    fileName,
}: {
    printRef: RefObject<HTMLDivElement>
    fileName: string
}) {
    async function handleDownload() {
        const element = printRef.current

        if (!element) {
            alert('Algo deu errado, tente movamente')
            return
        }

        const canvas = await html2canvas(element, { logging: true })
        const data = canvas.toDataURL('image/png')

        // Downloads image
        const link = document.createElement('a')
        link.href = data
        link.download = `${fileName}.png`

        document.body.appendChild(link)

        link.click()

        document.body.removeChild(link)
    }

    return (
        <Button
            variant={'outline'}
            size={'icon'}
            className="cursor-pointer"
            onClick={handleDownload}
        >
            <DownloadIcon />
        </Button>
    )
}
