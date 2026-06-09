import Portfolio from "../models/Portfolio.js";

export const getPortfolio=async(req, res)=>{
    try {
        const portfolio=await Portfolio.findOne({
            userId: req.user._id
        });
        if(!portfolio) 
            return res.status(401).json({
        message:"Portfolio not found! "
        });
        res.status(200).json({
            message:"Porfolio fetched successfully !",
            portfolio
        })

    } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });

    }
}