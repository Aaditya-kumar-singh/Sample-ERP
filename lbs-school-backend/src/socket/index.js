import { Server } from "socket.io";

let ioInstance = null;

export const initSocket = (httpServer, corsOrigin) => {
    ioInstance = new Server(httpServer, {
        cors: {
            origin: corsOrigin,
            credentials: true,
        },
    });

    ioInstance.on("connection", (socket) => {
        socket.on("transport:join-route", ({ routeId }) => {
            if (routeId) {
                socket.join(`route:${routeId}`);
            }
        });

        socket.on("transport:join-parent", ({ parentUserId }) => {
            if (parentUserId) {
                socket.join(`parent:${parentUserId}`);
            }
        });
    });

    return ioInstance;
};

export const getIO = () => ioInstance;
