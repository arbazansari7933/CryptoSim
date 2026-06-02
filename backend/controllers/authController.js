import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existEmail = await User.findOne({ email });
        //check db for already exist email
        if (existEmail)
            return res.status(400).json(
                { message: "Email already exist" }
            )
            //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //create new user
        const newUser = await User.create(
            {
                name: name,
                email: email,
                password: hashedPassword
            }
        );
        //response
        return res.status(200).json(

            {
                message: "Register Successfully ! ",
                userId: newUser._id,

            }
        )
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
};
export const login =async(req, res)=>{
    try {
        const{email, password}=req.body;
        const user= await User.findOne({email});
        if(!user) 
            return res.status(400).json(
            {
                message:"User not found! "
            }
        )
        const isMatch=await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json(
            {
                message: "Incorrect password !"
            }
        )
        const token = jwt.sign(
            { id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
          //  console.log(error);
        res.status(500).json({ message: "Server error" })
    }
};
export const getMe=async(req, res)=>{
    try {
                console.log("req.user =", req.user);
        const user=await User.findById(req.user.id).select("-password");
                console.log("db user =", user);

        if(!user) 
            return res.status(401).json(
                {message:"User Not Found !"}
            );
console.log(req.user);
    res.status(200).json(user)
        
    } catch (error) {
        res.status(500).json(
            { message: "Server error" }
        )
    }
   
}
