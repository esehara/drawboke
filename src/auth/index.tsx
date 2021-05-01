import {useState, useEffect} from "react";
import firebase from "firebase/app";
import "firebase/auth";
import {useHistory} from 'react-router';
const auth = firebase.auth();
auth.useEmulator("http://localhost:9099");


function GoogleLoginResult() {
    const history = useHistory();

    const [has_message, setHasMessage] = useState(false);
    const [message_text, setMessageText] = useState("あとすこしだぜ");
    const [user, setUser] = useState< firebase.User | null >(null);

    useEffect(() => {
        firebase.auth()
            .onAuthStateChanged((user) =>  {
                setHasMessage(true);
                if (user) {
                    setMessageText("やったぜ");
                    setUser(user);
                    history.replace("/user/esehara");
                }
            });
        }, []);

    return (
        <div>
            { has_message &&
                <div>
                    <h2> { message_text } </h2>
                    { user &&
                        <div>
                            <p> ようこそ、{ user.displayName } さん </p>
                        </div>
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
            onClick={() => redirect() }
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