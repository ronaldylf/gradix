import { ITimeSlot } from "@/interfaces/ITimeSlot";
import defaultChair from "./DefaultChair";

const defaultSlot: ITimeSlot = {
    childChair: defaultChair,
    col: -1,
    row: -1
}

export default defaultSlot;