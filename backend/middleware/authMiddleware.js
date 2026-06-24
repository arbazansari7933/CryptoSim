import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({
            message: "Token not provided"
        })
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
        return res.status(401).json({ message: "No token provided (wrong format)" });
    }
    const token = authHeader.split(" ")[1];
    //verify
    let decoded;
    try {
         decoded = jwt.verify(token, process.env.JWT_SECRET);

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user)
        return res.status(401).json(
            {
                message: "Not Allowed !"
            })
    //  Attach user to request object
    req.user = user;
    //  Continue to next route
    //console.log("Decoded:", decoded);
//console.log("User:", user);
    next();

}