import React from "react";
import ReactDom from "react-dom";

import { GoogleLoginButton } from "./auth";
const domGoogleLoginButton = document.querySelector("#google_login_button");
ReactDom.render(GoogleLoginButton(), domGoogleLoginButton);