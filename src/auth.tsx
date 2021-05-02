import {useState, useEffect} from "react";
import firebase from "firebase"

export function checkLoginUser() {
    const [login_user, setUser] = useState< firebase.User | null >(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            setUser(user);
        });
    }, []);

    return login_user;
}