import { ThemeProvider } from "@emotion/react";
import firebase from "firebase/app";
import "firebase/firestore";
import { Boke } from "./boke";

export type UserProps = {
    user: DrawbokeUser;
}

const recentMaxLength: number = 8;

export class DrawbokeUser {
    uid?: string;
    displayName: string;
    screenName: string;
    twitterUid?: string;
    recentBoke: Array<Boke>;

    constructor(
        displayName: string, 
        screenName: string, 
        twitterUid?: string,

        uid?: string | undefined,    
        recentBoke?: Array<Boke>)
    {
        this.displayName = displayName;
        this.screenName = screenName;
        this.twitterUid = twitterUid;

        this.uid = uid;
        this.recentBoke = recentBoke ?? [];
    }

    async addBoke(boke: Boke, db: firebase.firestore.Firestore) {
        this.recentBoke.unshift(boke);
        if (this.recentBoke.length > recentMaxLength) {
            this.recentBoke.pop();
        }
        return await db.collection("users")
                .withConverter(drawbokeConverter)
                .doc(this.uid)
                .set(this);
    }

    toPost(): Object {
        return {
            uid: this.uid,
            displayName: this.displayName,
            screenName: this.screenName,
        }
    }
    toConverter(): Object {
        const recentBoke = this.recentBoke.map((a) => a.toUser());
        return {
            displayName: this.displayName,
            screenName: this.screenName,
            twitterUid: this.twitterUid,
            recentBoke: recentBoke,
        }
    }
}

const drawbokeConverter: firebase.firestore.FirestoreDataConverter<DrawbokeUser> = {
    toFirestore(drawbokeUser: DrawbokeUser): 
        firebase.firestore.DocumentData {
            return drawbokeUser.toConverter();
    },
    fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot, 
        options: firebase.firestore.SnapshotOptions):
    DrawbokeUser {
        const data = snapshot.data(options);
        const recentBoke = data.recentBoke.map(
            (a: any) => new Boke(a.text, undefined, a.uid));
        return new DrawbokeUser(
            data.displayName, 
            data.screenName, 
            data.twitterUid,
            snapshot.id,
            data.recentBoke);
    }
}

export async function getFromAuthToStore(
    db: firebase.firestore.Firestore,
    user: firebase.User | null) {
        console.log("getFromAuthToStore");
        if (!user) {
            return null;
        } else {
            const query = await db.collection("users")
                .where("twitterUid", "==", user.uid)
                .withConverter(drawbokeConverter)
                .get();
            if (query.docs.length > 0){
                return query.docs[0].data();
            } else {
                return null;
            }
        }
    }

export async function addFromAuthToStore(
    db: firebase.firestore.Firestore,
    auth: firebase.auth.UserCredential) {
    if (!auth.user) { 
        return null;
    } else {
        
        const userDocRef = db
            .collection("users")
            .withConverter(drawbokeConverter)
            .where("twitterUid", "==", auth.user.uid);

        const docs = (await userDocRef.get({source: "server"})).docs;

        if (docs[0] !== undefined){
            
            return docs[0].data();

        } else {
            const userScreenName = auth.additionalUserInfo?.username ?? null;
            const userDisplayName = auth.user.displayName;
            let drawbokeUserDB = null;
            if (userDisplayName !== null) {
                drawbokeUserDB = await db.collection("users")
                    .withConverter(drawbokeConverter)
                    .add(new DrawbokeUser(
                        userDisplayName,
                        (userScreenName) ? userScreenName : userDisplayName,
                         auth.user.uid));
            } else if (userScreenName !== null && userScreenName !== undefined) {
                drawbokeUserDB = await db.collection("users")
                    .withConverter(drawbokeConverter)
                    .add(new DrawbokeUser(
                        userDisplayName ? userDisplayName : userScreenName,
                        userScreenName,
                        auth.user.uid));
            } else {
                throw Error("Invalid User Data: Dont exist display name and scree name");
            }
            const drawbokeUser = (await drawbokeUserDB.get()).data();
            return drawbokeUser ? drawbokeUser : null;
        }
    }
}