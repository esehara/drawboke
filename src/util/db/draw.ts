import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import { DrawbokeUser } from "./user"
import Stage from "konva";

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

export function uploadImage(
    imageStr: string,
    user: DrawbokeUser) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef
        .child("images/" + user.screenName + new Date().toString() + ".png")
        .putString(imageStr);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        function(snapshot: any) {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log('Upload is running');
              break;
          }
        }, function(error: any) {

          console.log(error)

        }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(
          (downloadURL: string) => {
            console.log('File available at', downloadURL);
        });
    }); 
}