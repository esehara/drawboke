import firebase from "firebase/app";
import { Link, useParams } from "react-router-dom";
import { checkLoginUser } from "../auth";

export function RedirectForSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
}  

function UserLogout() { 
    firebase.auth().signOut();
}

function UserToolbarButtons() {
    const login_user = checkLoginUser();
    return(
        <div>
            { login_user 
            ?   (<ul>
                    <li><Link to="/user/esehara">{ login_user.displayName }</Link></li>
                    <li><Link to="/draw/new">絵を描く</Link></li>
                    <li><Link to="/boke/new">絵に一言</Link></li>
                    <li>
                        <button 
                            onClick={() => { UserLogout(); }} 
                        > Log out </button></li>
                </ul>)

            :   (<ul>
                    <li>
                        <button
                            onClick={() => { RedirectForSignIn(); }}
                        > PLAY </button>
                        </li>
                </ul>)
            
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

