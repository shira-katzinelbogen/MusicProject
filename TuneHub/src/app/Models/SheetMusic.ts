import Instrument from "./Instrument";
import sheetMusicCategory from "./SheetMusicCategory";
import Users from "./Users";

export enum DifficultyLevel {
    BEGINNER, INTERMEDIATE, ADVANCED
}


export enum Scale {
    C, D, E, F, G, A, B,

    // SHARP = (#)
    C_MAJOR, D_MAJOR, F_MAJOR, G_MAJOR, A_MAJOR,

    // FLAT = (b)
    D_MINOR, E_MINOR, G_MINOR, A_MINOR, B_MINOR
}


export default class SheetMusic {
    // name(arg0: string, name: any, arg2: string, rating: number | undefined) {
    //   throw new Error('Method not implemented.');
    // }
    id?: number;
    title?: string;
    scale?: Scale;
    likes?: number = 0;
    hearts?: number = 0;
    dateUploaded?: Date;
    name?: string;
    level?: DifficultyLevel;
    user?: Users;
    instruments?: Instrument[]
    category?: sheetMusicCategory[]
    categories?: sheetMusicCategory[]
    usersFavorite?: Users[];
    filePath?: string;
    downloads?: number;
    pages?: number;
    rating?: number;
    isLiked?: boolean;
    isFavorite?: boolean;
    imageCoverName?: string;
    composer?: string;
    lyricist?: string;

}