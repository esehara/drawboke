import firebase from "firebase/app";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function UserLogout() { 
    firebase.auth().signOut()
        .then(() => { history.go(0); })
        .catch(console.error);
}

function UserToolbarButtons() {
    const [login_user, setUser] = useState< firebase.User | null >(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
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

export function UserToolbar() {
    return (
        <div>
            <h1>DrawBoke</h1>
            <UserToolbarButtons />
        </div>
    );
}
type UserPageParams = { user_id: string};
export function UserPage() {
    let { user_id }  = useParams<UserPageParams>();
    return (
        <div>
            <h1>{ user_id }</h1>
        </div>
    )
}