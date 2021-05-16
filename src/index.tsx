import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

// TODO: あとでどこかにまとめる

import ReactDom from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

/*
  TODO: あとでUserPageとLoginPageを同じファイルにする
  TODO: できるなら各デフェクトリのindex.tsxにコンポーネントを集めたい
*/

import { LoginPage } from "./auth/index";
import { Header } from "./auth/header";
import { DrawingPage } from "./draw/index";
import { BokePage } from "./boke/index";
import { UserPage } from "./user/index";
import { ShowDrawingPage, ShowCaptionPage} from "./show/index";
import { NotFoundPage } from "./notfound";
import { useState, useEffect, useRef } from "react";
import { ChakraProvider, extendTheme, Spinner} from "@chakra-ui/react"

const defaultTheme = extendTheme({
    colors: {
        white: "#fff6eb"
    },
    component: {
        Box: {
            baseStyle: {
                p: 2,
            }
        }
    },
    styles: {
        global: {
            body: {
                bg: "#fdebd1",
                color: "#4e3819",
            }
        }
    }
});

const firebaseConfig = {
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
firebase.firestore().settings({ignoreUndefinedProperties: true});

if (process.env.NODE_ENV=="development") {
    firebase.auth().useEmulator("http://localhost:9099");
    firebase.database().useEmulator("localhost", 9000);
    firebase.firestore().useEmulator("localhost", 8080);    
}

const provider = new firebase.auth.TwitterAuthProvider();

import { addFromAuthToStore, getFromAuthToStore, DrawbokeUser } from "./util/db/user";

export default function Root() {
    const [loginState, setLoginState] = useState("init");
    const user = useRef<DrawbokeUser | null>(null);
    const isRedireced = window.localStorage.getItem("redirected");

    const RedirectForSignIn = () => {
        window.localStorage.setItem("redirected", "true");
        firebase.auth().signInWithRedirect(provider);
    }  

    useEffect(() => {
        console.log(loginState);
        switch(loginState) {
            case "init":
                if ( isRedireced === "true") {
                    firebase.auth().getRedirectResult()
                        .then((credential) => {
                            console.log("getRedirectResult")
                            return addFromAuthToStore(firebase.firestore(), credential)
                                .then((drawbokeUser) => { 
                                    console.log("addFromAuthToStore");
                                    user.current = drawbokeUser; 
                                    return;
                                });
                        })
                        .finally(() => {
                            console.log("getRedirectResult.finally");
                            setLoginState("check");
                            window.localStorage.removeItem("redirected");
                        });
                } else {
                    setLoginState("check");
                }
                break;
            case "check":
                firebase.auth().onAuthStateChanged((userFromAuth) => {
                        console.log("onAuthStateChange");
                        getFromAuthToStore(firebase.firestore(), userFromAuth).then(
                            (userFromStore) => {
                                console.log("getFromAuthToStore.then");
                                user.current = userFromStore;
                                setLoginState("render");
                        });
                });            
                break;
        }
    }, [loginState]);

    return (
<ChakraProvider theme={ defaultTheme }>
    <Router>
    {(loginState === "render") && 
        (<Header
            user={user} 
            RedirectForSignIn={ () => { RedirectForSignIn(); } } />)}
    {(loginState !== "render")
        ? (<Spinner size="xl" />)
        : (<MainPage user={user} db={firebase.firestore()} storage={firebase.storage()}/>) }
    </Router>
</ChakraProvider>)
}

type MainProps = {
    user: React.MutableRefObject<DrawbokeUser | null>,
    db: firebase.firestore.Firestore
    storage: firebase.storage.Storage
}

function MainPage(props: MainProps) {
    return (
<Switch>
    <Route exact path="/"> <LoginPage /> </Route>
    <Route path="/draw/:id">
        <DrawingPage user={props.user} db={props.db} storage={props.storage} /> 
    </Route>
    <Route path="/boke/:id"><BokePage user={props.user} db={props.db} /> </Route>
    <Route path="/show/draw/:id">
        <ShowDrawingPage />
    </Route>
    <Route path="/show/boke/:id">
        <ShowCaptionPage />
    </Route>
    <Route path="/user/:id" children={ <UserPage /> } />
    <Route path="*"><NotFoundPage /></Route>
</Switch>);

}
function App() {
    ReactDom.render(<Root />,document.getElementById('root'));
}
App();