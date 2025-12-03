export interface SheetMusicCategoryResponseDTO {
    id: number | null;
    name: string;
}

export interface InstrumentResponseDTO {
    id: number | null;
    name: string;
}

export interface SheetMusicResponseAI {
    title: string;
    scale: string;
    instruments: InstrumentResponseDTO[];
    difficulty: string;
    suggestedCategories: SheetMusicCategoryResponseDTO[];
    composer: string;
    lyricist: string;
}