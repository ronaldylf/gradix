import { RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { TimeTableContext } from "@/utils/TimeTableContext";
import React from "react";
import { getDefaultTable } from "@/utils/DefaultTable";
import { toast } from "sonner";

function ClearTable() {
    const tableContext = React.useContext(TimeTableContext)
    const [timeTable, setTimeTable] = tableContext.timeTable;

    return (
        // add a tooltip later
        <Button size={ "icon" } className="cursor-pointer" onClick={ () => {
            setTimeTable(getDefaultTable())
            toast("Grade reiniciada.")
        }}>
            <RefreshCcw/>
        </Button>
    )
}

export default ClearTable;