import type Users from "./Users";

export default class Teacher {

    pricePerLesson!: number;
    experience!: number;
    lessonDuration!: number;
    rating?: number;
    students?: Users[];
    dateUploaded?: Date;
    instrumentsIds!: number[] | null;
}