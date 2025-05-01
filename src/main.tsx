import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import {ToastContainer} from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
      <ToastContainer position="top-right" autoClose={1500} theme="colored" />
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
