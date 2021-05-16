import firebase from "firebase/app";
import "firebase/firestore";
import { DrawbokeUser } from "./user";

const BokeTextMax = 80;
export const isOkBokeTextLength: (a: string) => boolean = 
    (text: string) => text.length < BokeTextMax;

export class Boke {
    uid?: string;
    text: string;
    parent?: Object;
    children: Array<Object>;
    user?: DrawbokeUser;
    createDate: firebase.firestore.Timestamp;

    constructor(
        text: string, 
        user?: DrawbokeUser,
        uid?: string,
        parent?: Object, 
        children?: Array<Object>, 
        date?: firebase.firestore.Timestamp) {

        if (!isOkBokeTextLength(text)) {
            throw Error("Longer strings than specified:"
                            + text.length.toString() + "size");
        }

        this.text = text;
        this.user = user;
        this.uid = uid;
        this.parent = parent;
        this.children = children ?? [];
        this.createDate = date ?? firebase.firestore.Timestamp.fromDate(new Date());   
    }

    toUser(): Object {
        return {
            uid: this.uid,
            text: this.text
        }
    }
}

const bokeConverter: firebase.firestore.FirestoreDataConverter<Boke> = {
    toFirestore(boke: Boke):
        firebase.firestore.DocumentData {
            return {
                text: boke.text,
                user: boke.user?.toPost(),
                parent: boke.parent,
                children: boke.children,
                createDate: boke.createDate
            }
        },
    fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions): 
    Boke {
        const data = snapshot.data(options);
        const dataUser = new DrawbokeUser(
            data.displayName,data.screenName,undefined,data.uid);
        return new Boke(
            data.text,
            dataUser,
            snapshot.id,
            data.parent,
            data.children,
            data.createDate,            
        )
    }   
}

export async function addBoke(
    text: string,
    user: DrawbokeUser,
    ) {
    const bokeDocRef = firebase
        .firestore()
        .collection("boke")
        .withConverter(bokeConverter);
    const newBoke = new Boke(text, user)
    const result = (await bokeDocRef.add(newBoke));
    
    if (undefined === result) {
        throw Error("Cannot create new Boke");
    }
    await user.addBoke(newBoke);
    return newBoke;
}