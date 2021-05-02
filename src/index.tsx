import firebase from "firebase/app";
import { ChakraProvider } from "@chakra-ui/react"
// TODO: あとでどこかにまとめる
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

import React from "react";
import ReactDom from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
/*
  TODO: あとでUserPageとLoginPageを同じファイルにする
  TODO: できるなら各デフェクトリのindex.tsxにコンポーネントを集めたい
*/

import { LoginPage } from "./auth/index";
import { UserToolbar} from "./auth/toolbar";
import { DrawingPage } from "./draw/index";
import { BokePage } from "./boke/index";
import { UserPage } from "./user/index";
import { ShowDrawingPage, ShowCaptionPage} from "./show/index";
import { NotFoundPage } from "./notfound";

export default function RootScreen() {
    return (

<ChakraProvider>
    <Router>
        <div>
                <UserToolbar />
        </div>
        <Switch>
            <Route exact path="/"> <LoginPage /> </Route>
            <Route path="/draw/:id"><DrawingPage /> </Route>
            <Route path="/boke/:id"><BokePage /> </Route>
            <Route path="/show/draw/:id"><ShowDrawingPage /></Route>
            <Route path="/show/boke/:id"><ShowCaptionPage /></Route>
            <Route path="/user/:id" children={ <UserPage /> } />
            <Route path="*"><NotFoundPage /></Route>
        </Switch>
    </Router>
</ChakraProvider>

    );
}

ReactDom.render(
    <RootScreen />,
    document.getElementById('root')
)