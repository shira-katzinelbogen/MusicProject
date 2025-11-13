import  Post  from "./Post";
import  Users  from "./Users";

export default class Comment {
    id?: number;
    likes?: number;
    user?: Users;
    post?: Post;
    content?: string;
    dateUploaded?: Date;
}