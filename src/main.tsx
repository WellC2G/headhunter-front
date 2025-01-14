import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import {SocketProvider} from "./components/UseInitSocket.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <SocketProvider>
            <App />
        </SocketProvider>
    </React.StrictMode>
);
