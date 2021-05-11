import firebase from "firebase";
import "firebase/firestore";

export class DrawbokeUser {
    displayName: string;
    screenName: string;
    twitterUid: string;

    constructor(displayName: string, screenName: string, twitterUid: string)
    {
        this.displayName = displayName;
        this.screenName = screenName;
        this.twitterUid = twitterUid;
    }
}

const drawbokeConverter: firebase.firestore.FirestoreDataConverter<DrawbokeUser> = {
    toFirestore(drawbokeUser: DrawbokeUser): 
        firebase.firestore.DocumentData {
            return {
                displayName: drawbokeUser.displayName,
                screenName: drawbokeUser.screenName,
                twitterUid: drawbokeUser.twitterUid,
            };
    },
    fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot, 
        options: firebase.firestore.SnapshotOptions):
    DrawbokeUser {
        const data = snapshot.data(options);
        return new DrawbokeUser(data.displayName, data.screenName, data.twitterUid);
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
        throw Error("User is not Authenticated (addFromAuthToStore) "); 
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