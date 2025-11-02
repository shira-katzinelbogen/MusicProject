import Users from "./Users";

export default class Post {
    id?: number;
    user?: Users;
    content?: string;
    hearts?: number;
    likes?: number;
    audio?: string;
    video?: string;
    dateUploaded?: Date;
    comments?: Comment[];
    imagesPath?: string;
    audiosPath?: string;
    usersFavorite?: Users[];
}