import { ITimeTable } from '@/interfaces/ITimeTable'
import ClearTable from './ClearTable'
import DeleteTable from './DeleteTable'
import DownloadTable from './download-table'
import EditTable from './EditTable'
import CloseTable from './CloseTable'
import { RefObject } from 'react'

export default function TableOptions({
    userId,
    tableId,
    timeTable,
    printRef,
}: {
    userId: string
    tableId: string
    timeTable: ITimeTable
    printRef: RefObject<any>
}) {
    return (
        <div className="flex items-center border rounded-sm p-2 w-full justify-evenly md:justify-center md:gap-5">
            <ClearTable userId={userId} tableId={tableId} />
            <DeleteTable
                userId={userId}
                tableId={tableId}
                caption={timeTable.caption || ''}
            />
            <DownloadTable
                printRef={printRef}
                fileName={timeTable.caption || ''}
            />
            <EditTable
                tableId={tableId}
                currentCaption={timeTable.caption || ''}
            />
            <CloseTable />
        </div>
    )
}
