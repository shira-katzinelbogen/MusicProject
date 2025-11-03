import sheetMusic from "./SheetMusic";
import Teacher from "./Teacher";
import Users from "./Users";

export default class Instrument {
    id?: string;
    name?: string;
    users?: Users[];
    teachers?: Teacher[];
    sheetsMusic?: sheetMusic[];
}