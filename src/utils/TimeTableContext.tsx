import React, { Dispatch, SetStateAction, useState } from "react";
import { ITimeTable } from "@interfaces/ITimeTable";
import { getDefaultTable } from "./DefaultTable";

interface ITimeTableStore {
    timeTable: [ITimeTable, Dispatch<SetStateAction<ITimeTable>>];
}
export const TimeTableContext = React.createContext<ITimeTableStore>({
    timeTable: [getDefaultTable(),
        () => {}
    ]
});

export default ({ children }: any) => {
    const [timeTable, setTimeTable] = useState<ITimeTable>(getDefaultTable())

    const store: ITimeTableStore = {
        timeTable: [timeTable, setTimeTable],
    }
    
    return <TimeTableContext.Provider value={ store }>{ children }</TimeTableContext.Provider>
}