import SheetMusic  from "./SheetMusic";
import  Teacher  from "./Teacher";
import  Users from "./Users";

export default class Instrument {
    id!: number | undefined;
    name!: string;
    users?: Users[];
    teachers?: Teacher[];
    sheetsMusic?: SheetMusic[];
}