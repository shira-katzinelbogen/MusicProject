import Instrument from "./Instrument";
import Users from "./Users";

export default class Teacher extends Users {
    pricePerLesson?: number;
    experience?: number;
    lessonDuration?: number;
    rating?: number;
    students?: Users[];
    dateUploaded?: Date;
    instruments?: Instrument;
}