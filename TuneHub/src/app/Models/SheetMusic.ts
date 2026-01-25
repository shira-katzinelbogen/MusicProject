import Instrument from "./Instrument";
import sheetMusicCategory from "./SheetMusicCategory";
import { SheetMusicCategoryResponseDTO } from "./SheetMusicResponseAI";
import Users, { InstrumentResponseDTO, UsersProfileDTO } from "./Users";


export enum DifficultyLevel {
    BEGINNER, INTERMEDIATE, ADVANCED
}

export enum Scale {
    C, D, E, F, G, A, B,
    C_MAJOR, D_MAJOR, F_MAJOR, G_MAJOR, A_MAJOR,
    D_MINOR, E_MINOR, G_MINOR, A_MINOR, B_MINOR
}

export default class SheetMusic {
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
    categories?: sheetMusicCategory[]
    usersFavorite?: Users[];
    filePath?: string;
    downloads?: number;
    pages?: number;
    rating?: number;
    liked?: boolean;
    favorite?: boolean;
    imageCoverName?: string;
    composer?: string;
    lyricist?: string;
}

export interface SheetMusicResponseDTO {
    id: number;
    title: string;

    instruments: InstrumentResponseDTO[];
    categories: SheetMusicCategoryResponseDTO[];

    level: DifficultyLevel;
    scale: Scale;

    filePath: string;
    user: UsersProfileDTO;

    dateUploaded: string;
    downloads: number;
    pages: number;

    imageCoverName: string;
    rating: number;

    liked: boolean;
    favorite: boolean;

    hearts: number;
    likes: number;

    composer: string;
    lyricist: string;
}