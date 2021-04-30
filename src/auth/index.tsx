import {useState, useEffect} from "react";
import firebase from "firebase/app";
import "firebase/auth";

// TODO: あとでどこかにまとめる
export const firebaseConfig = {
    apiKey: "AIzaSyAkgTEHqsih0lmwu1hx0IYrJH8RakhYXwA",
    authDomain: "drawboke.firebaseapp.com",
    databaseURL: "https://drawboke-default-rtdb.firebaseio.com",
    projectId: "drawboke",
    storageBucket: "drawboke.appspot.com",
    messagingSenderId: "1008146064966",
    appId: "1:1008146064966:web:9e496005f27b3392d70c47",
    measurementId: "G-RJ2NWBQ1V5"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const Firebase = firebase;


function GoogleLoginResult() {
    const [has_message, setHasMessage] = useState(false);
    const [message_text, setMessageText] = useState("まだなにもしていないぜ");
    const [user, setUser] = useState< firebase.User | null >(null);

    useEffect(() => {
        firebase.auth() 
        .getRedirectResult()
        .then((result) =>  {
            /** @type {firebase.auth.OAuthCredential} */
            const credential = result.credential;
            if (result.credential) {
                // const token = result.credential?
                console.log(result.user);
                setUser(result.user);
                setHasMessage(true);
                setMessageText("やったぜ");
            }
        }).catch((error) => {
            setHasMessage(true);
            setMessageText("失敗したぜ");
        });
    }, []);
    return (
        <div>
            { has_message &&
                <div>
                    <h2> { message_text } </h2>
                    { user &&
                        <p> ようこそ、{ user.displayName } さん </p>
                    }
                </div>
            }
        </div>
    );        
}

function GoogleLoginButton() {
    const redirect = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    return (
        <button
            onClick = {() => redirect() }
        >
            いますぐクリッコ
        </button>
    )
}

export function LoginScreen() {
    return (
        <div>
            <h1>あなたとドロー<br />いますぐダウンロー<br />ド</h1>
            <GoogleLoginResult />
            <GoogleLoginButton />
        </div>
    )
}