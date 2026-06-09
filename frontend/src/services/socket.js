import { io } from "socket.io-client";
console.log("BACKEND_URI =", import.meta.env.VITE_BACKEND_URI);
const socket=io("https://cryptosim-t6b4.onrender.com",{
    auth: {
    token: localStorage.getItem("token"),
    },
}

);
export default socket;