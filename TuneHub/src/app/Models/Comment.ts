import  Post  from "./Post";
import  Users  from "./Users";

export default class Comment {
    id?: number;
    likes?: number;
    isLiked?:boolean
    user?: Users;
    post?: Post;
    content?: string;
    dateUploaded?: Date;
    profile?: {
        id?: number;
        name?: string;
        imageProfilePath?: string | null;
        roles?: { name: string }[];
    };
}