import firebase from "firebase/app";
import "firebase/firestore";
import { DrawbokeUser } from "./user"

export class Draw {
    uid?: string;
    filename: string;
    parent?: Object;
    children: Array<Object>;
    user?: DrawbokeUser;
    createDate: firebase.firestore.Timestamp;

    constructor(
        filename: string,
        user?: DrawbokeUser,
        uid?: string,
        parent?: Object,
        children?: Array<Object>,
        date?: firebase.firestore.Timestamp,
    ) {
        this.filename = filename;
        this.user = user;
        this.uid = uid;
        this.parent = parent;
        this.children = children ?? [];
        this.createDate = date ?? firebase.firestore.Timestamp.fromDate(new Date());   
    }

}