import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import { DrawbokeUser } from "./user"


export class Drawing {
  uid?: string;
  filename?: string;
  parent?: Object;
  children: Array<Object>;
  user?: DrawbokeUser;
  base64?: string;
  createDate: firebase.firestore.Timestamp;

  constructor(
    user?: DrawbokeUser,
    base64?: string,
    uid?: string,
    filename?: string,
    parent?: Object,
    children?: Array<Object>,
    date?: firebase.firestore.Timestamp,
  ) {
    this.filename = filename;
    this.user = user;
    this.uid = uid;
    this.base64 = base64;
    this.parent = parent;
    this.children = children ?? [];
    this.createDate = date ?? firebase.firestore.Timestamp.fromDate(new Date());
  }

  /**
   * ファイル名を作成するためのメソッドです。
   * 
   * @remakes
   * ファイル名の仕様としては`ユーザー名 + タイムスタンプ`という形で作られるようになっています。
   * 
   * @returns self
   */
  createFilename(): Drawing {
    if ( null === this.user || undefined === this.user ) { 
      throw Error("Does not set user data");
    }
    this.filename = "images/" + this.user.screenName + new Date().getTime() + ".png";
    return this;
  }

  /**
   * DrawingインスタンスにセットされたBase64文字列をクリアするためのメソッドです。
   * ローカル開発環境においては、Base64を直でデータベースに保管するので実質何もしませんが、
   * ステージング環境ではStorageに保管するので、Base64文字列は必要なくなります。
   * なので、`undefined`を使い、クリアしてあげるようにします。
   * 
   * @returns self
   */
  clearBase64(): Drawing {
    if (process.env.NODE_ENV === "development") {
      return this;
    } else {
      this.base64 = undefined;
      return this;
    }
  }

}

const drawingConverter: firebase.firestore.FirestoreDataConverter<Drawing> = {
  toFirestore(draw: Drawing):
      firebase.firestore.DocumentData {
          return {
              filename: draw.filename,
              base64: draw.base64,
              user: draw.user?.toPost(),
              parent: draw.parent,
              children: draw.children,
              createDate: draw.createDate
          }
      },
  fromFirestore(
      snapshot: firebase.firestore.QueryDocumentSnapshot,
      options: firebase.firestore.SnapshotOptions): 
  Drawing {
      const data = snapshot.data(options);
      const dataUser = new DrawbokeUser(
        data.displayName,data.screenName,undefined,data.uid);
      return new Drawing(
          dataUser,
          data.base64,
          snapshot.id,
          data.filename,
          data.parent,
          data.children,
          data.createDate,            
      )
  }   
}

function uploadImageToStorage(draw: Drawing): Promise<Drawing> {
  if (undefined === draw.base64 || undefined === draw.filename) {
    throw Error("Invalid Drawing Class: maybe any field is undefined?");
  }
  const imageStr = draw.base64;
  const storageRef = firebase.storage().ref();
  const uploadTask = storageRef
    .child(draw.filename)
    .putString(imageStr);

  return new Promise(function(resolve, reject) {
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    function (snapshot: any) {
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
    }, function (error: any) {

      console.log(error)

    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(
        (downloadURL: string) => {
          console.log('File available at', downloadURL);
          resolve(draw);
        });
    });
  });
}

/**
 * 絵を描いたファイルをアップロードするときに使います。
 * 
 * @remarks
 * ローカル開発環境下ではアップロードする過程が存在していないので、
 * ただDrawingモデルをラップしているだけにとどまります。
 * 
 * @param draw - Drawingクラス
 * 
 */
function uploadImage(draw: Drawing) {
  if (undefined === draw.user || undefined === draw.base64) {
    throw Error("Missing Initilization for uploading image: user is " 
      + (typeof draw.user) + "and base64 is " + (typeof draw.base64) );
  }

  if ("development" == process.env.NODE_ENV) {
    return new Promise((resolve, reject) => { resolve(draw) });
  } else {
    return uploadImageToStorage(draw);
  }
}


/**
 * Drawのデータを書き込みます
 * 
 * @remarks
 * この関数は開発環境下(process.env.NODE_ENV)とステージング環境では挙動が変わります。
 * その理由としては、firebaseのstorageをローカル環境下でテストするためのエミュレーターが提供されていません。
 * そのため、base64データをDrawクラスにぶら下げる形にしています。
 * 
 * @param imageStr 
 * @param user 
 * 
 * @public
 */
export async function addDraw(imageStr: string, user: DrawbokeUser) {
  console.log("addDraw");
  const drawing = new Drawing(user, imageStr).createFilename();
  await uploadImage(drawing);
  drawing.clearBase64();
  return (await firebase.firestore().collection("drawing")
    .withConverter(drawingConverter)
    .add(drawing));
}