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
    id?: number;
    title?: string;
    scale?: Scale;
    likes?: number = 0;
    hearts?: number = 0;
    dateUploaded?: Date;
    level?: DifficultyLevel;
    user?: Users;
    instruments?: Instrument[]
    categories?: sheetMusicCategory[]
    usersFavorite?: Users[];
    filePath?: string;
    downloads?: number;
    pages?: number;

    isLiked?: boolean;
    isFavorite?: boolean;
    imageCoverName?: string;
    composer?: string;
    lyricist?: string;

}