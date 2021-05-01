import {useState, useEffect} from "react";
import firebase from "firebase/app";
import "firebase/auth";
import {useHistory} from 'react-router';
import { RedirectForSignIn } from "./toolbar";
const auth = firebase.auth();
auth.useEmulator("http://localhost:9099");

export function LoginPage() {
    return (
        <div>
            <h1>あなたとドロー<br />いますぐダウンロー<br />ド</h1>
            <button
                onClick={() => RedirectForSignIn() }
            >
                いますぐクリッコ
            </button>
        </div>
    )
}