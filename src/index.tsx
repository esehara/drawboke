import React from "react";
import ReactDom from "react-dom";

import { LoginScreen } from "./auth/index";

const domLoginScreenElement = document.querySelector("#login_screen");
ReactDom.render(<LoginScreen />, domLoginScreenElement);

