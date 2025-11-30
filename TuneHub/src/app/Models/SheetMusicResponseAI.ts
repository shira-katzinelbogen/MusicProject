// Models/SheetMusicResponseAI.ts (קובץ חדש)

import Instrument from "./Instrument";
import SheetMusicCategory from "./SheetMusicCategory";

// הגדרת DTO ל-Category בדומה ל-InstrumentResponseDTO
export interface SheetMusicCategoryResponseDTO {
    id: number | null;
    name: string;
}

// הגדרת DTO ל-Instrument בדומה ל-InstrumentResponseDTO
export interface InstrumentResponseDTO {
    id: number | null;
    name: string;
}

export interface SheetMusicResponseAI {
    title: string;
    scale: string; // תואם ל-EScale
    instruments: InstrumentResponseDTO[];
    difficulty: string; // תואם ל-EDifficultyLevel
    suggestedCategory: SheetMusicCategoryResponseDTO[]; // שימו לב: השדה הזה מגיע מה-AI
    composer: string;
    lyricist: string;
}