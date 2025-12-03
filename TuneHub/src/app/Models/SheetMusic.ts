import Instrument from "./Instrument";
import sheetMusicCategory from "./SheetMusicCategory";
import Users from "./Users";


export enum DifficultyLevel {
    BEGINNER, INTERMEDIATE, ADVANCED
}

export const DifficultyDisplayMap: Record<DifficultyLevel, string> = {
    [DifficultyLevel.BEGINNER]: "Beginner",
    [DifficultyLevel.INTERMEDIATE]: "Intermediate",
    [DifficultyLevel.ADVANCED]: "Advanced",
};

export enum Scale {
    C, D, E, F, G, A, B,
    C_MAJOR, D_MAJOR, F_MAJOR, G_MAJOR, A_MAJOR,
    D_MINOR, E_MINOR, G_MINOR, A_MINOR, B_MINOR
}

export const ScaleDisplayMap: Record<Scale, string> = {
    [Scale.C]: "C",
    [Scale.D]: "D",
    [Scale.E]: "E",
    [Scale.F]: "F",
    [Scale.G]: "G",
    [Scale.A]: "A",
    [Scale.B]: "B",

    [Scale.C_MAJOR]: "C Major",
    [Scale.D_MAJOR]: "D Major",
    [Scale.F_MAJOR]: "F Major",
    [Scale.G_MAJOR]: "G Major",
    [Scale.A_MAJOR]: "A Major",

    [Scale.D_MINOR]: "D Minor",
    [Scale.E_MINOR]: "E Minor",
    [Scale.G_MINOR]: "G Minor",
    [Scale.A_MINOR]: "A Minor",
    [Scale.B_MINOR]: "B Minor",
};

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
    favorited?: boolean;
    imageCoverName?: string;
    composer?: string;
    lyricist?: string;
}