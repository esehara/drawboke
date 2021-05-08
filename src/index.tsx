import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
// TODO: あとでどこかにまとめる

import ReactDom from "react-dom";
import { useHistory } from "react-router";
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
import { useState, useLayoutEffect, useReducer, useEffect } from "react";
import { ChakraProvider, extendTheme, Spinner, Box } from "@chakra-ui/react"

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
firebase.auth().useEmulator("http://localhost:9099");
firebase.firestore().useEmulator("localhost", 8080);
firebase.database().useEmulator("localhost", 9000);

const provider = new firebase.auth.GoogleAuthProvider();
export default function Root() {
    const [loginState, setLoginState] = useState("ready");
    const history = useHistory();
    const isRedireced = window.localStorage.getItem("redirected");
    const RedirectForSignIn = () => {
        window.localStorage.setItem("redirected", "true");
        firebase.auth().signInWithRedirect(provider);
    }  

    useEffect(() => {
        console.log("----> LoginState");
        console.log(loginState);
        if (loginState === "ready") {
            firebase.auth().getRedirectResult().then((user) => {
                console.log(user);

                return user;
            }).catch((e) => {
                console.log("射精できないよー");
                console.log(e);

                return e;
            }).finally(() => {
                setLoginState("check");
            });
        } else if (loginState === "check") {
            firebase.auth().onAuthStateChanged((user) => { 
                console.log("でっかい巨根");
                console.log(user); 
                setLoginState("render");
            });            
        };
    }, [loginState]);

    return (
<ChakraProvider theme={ defaultTheme }>
    <Router>
    {(loginState === "render") && 
        (<Header RedirectForSignIn={ () => { RedirectForSignIn(); } } />)}
    {(loginState !== "render")
        ? (<Spinner size="xl" />)
        : (<MainPage />) }
    </Router>
</ChakraProvider>)
}

function MainPage(props: any) {
    return (
<Switch>
    <Route exact path="/"> <LoginPage /> </Route>
    <Route path="/draw/:id"><DrawingPage /> </Route>
    <Route path="/boke/:id"><BokePage /> </Route>
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