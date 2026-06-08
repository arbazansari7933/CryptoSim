import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import { marketState } from "../market/marketState.js";

export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find();
        const leaderboard = [];
        //console.log("1");

        for (const user of users) {
            const portfolio = await Portfolio.findOne({ userId: user._id });
            if (!portfolio) {
                console.log(
                    `${user.name} has no portfolio`
                );
                continue;
            }
            //console.log(user.name);
            //console.log(portfolio);
            let portfolioValue = 0;
           Object.keys(marketState).forEach((coin)=>{
            if(portfolio[coin]){
                portfolioValue+=portfolio[coin].quantity *
                marketState[coin];
            }
           });
            const totalValue = user.walletBalance + portfolioValue;
            leaderboard.push({
                name: user.name,
                totalValue,
            })
        }
        leaderboard.sort(
            (a, b) =>
                b.totalValue - a.totalValue
        )
        res.status(200).json(
            leaderboard
        );
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
}