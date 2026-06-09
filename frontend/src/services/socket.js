import { io } from "socket.io-client";
console.log("BACKEND_URI =", import.meta.env.VITE_BACKEND_URI);
const socket=io(import.meta.env.VITE_BACKEND_URI,{
    auth: {
    token: localStorage.getItem("token"),
    },
}

);
export default socket;