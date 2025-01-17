import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";

export const Config = {
    base_url: "http://localhost:3000",
    token_key: "token",
    companyId_key: "companyId",
};

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children?: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socket = io(Config.base_url, {
            query: { companyId: localStorage.getItem(Config.companyId_key)},
            auth: {
                Authorization: `Bearer ${localStorage.getItem(Config.token_key)!}`
            },
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            setSocket(socket);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
}