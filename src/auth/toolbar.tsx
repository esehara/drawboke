import firebase from "firebase/app";
import { Link } from "react-router-dom";
import { checkLoginUser } from "../auth";
import { Button } from "@chakra-ui/react";

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
                        <Button
                            onClick={() => { UserLogout(); }} 
                        > Log out </Button></li>
                </ul>)

            :   (<ul>
                    <li>
                        <Button
                            onClick={() => { RedirectForSignIn(); }}
                        > PLAY </Button>
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

