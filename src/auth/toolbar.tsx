import firebase from "firebase/app";
import { useState, useEffect } from "react";

function UserLogout() { 
    firebase.auth().signOut()
        .then(() => { history.go(0); })
        .catch(console.error);
}

function UserToolbarButtons() {
    const [login_user, setUser] = useState< firebase.User | null >(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            console.log("--> UserToolbar -->");
            console.log(user);
            setUser(user);
        });
    }, []);

    return(
        <div>
            { login_user 
            ?   (<ul>
                    <li>{ login_user.displayName }</li>
                    <li>
                        <button 
                            onClick={() => { UserLogout(); }} 
                        > Log out </button></li>
                </ul>)
            : <ul><li>Sign In</li></ul>
            }
        </div>
    )

}

export default function UserToolbar() {
    return (
        <div>
            <h1>DrawBoke</h1>
            <UserToolbarButtons />
        </div>
    );
}