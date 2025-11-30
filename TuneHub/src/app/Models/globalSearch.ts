export interface PostSearchDTO {
    id: number;
    title: string;
    userName: string;
    dateUploaded: string;
}

export interface SheetMusicSearchDTO {
    id: number;
    title: string;
    userName: string;
    dateUploaded: string;
    imageCoverName: string;
}

export interface UsersProfileDTO {

    id: number,
    name: string,
    imageProfilePath: string,
    roles: string[]


}

export interface UsersSearchDTO {
    profile: UsersProfileDTO;
    country: string;
    city: string;
}

export interface GlobalSearchResponseDTO {
    posts: PostSearchDTO[];
    sheetMusic: SheetMusicSearchDTO[];
    musicians: UsersSearchDTO[];
    teachers: UsersSearchDTO[];
}
