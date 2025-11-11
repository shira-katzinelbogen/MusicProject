import Instrument from "./Instrument";
import sheetMusicCategory from "./SheetMusicCategory";
import Users from "./Users";

export enum DifficultyLevel {
    EASY, MEDIUM, HARD
}


export enum Scale {
    C, D, E, F, G, A, B,

    // SHARP = (#)
    C_SHARP, D_SHARP, F_SHARP, G_SHARP, A_SHARP,

    // FLAT = (b)
    D_FLAT, E_FLAT, G_FLAT, A_FLAT, B_FLAT
}


export default class sheetMusic {
    id?: number;
    name?: string;
    scale?: Scale;
    likes?: number = 0;
    hearts?: number = 0;
    dateUploaded?: Date;
    level?: DifficultyLevel;
    user?: Users;
    instruments?: Instrument[]
    category?: sheetMusicCategory
    usersFavorite?: Users[];
    filePath?: string;
    downloads?: number;
    pages?: number;

    isLiked?: boolean;
    isFavorite?: boolean;
}