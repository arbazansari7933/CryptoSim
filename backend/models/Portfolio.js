import mongoose from "mongoose";
const PortfolioSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        BTC: {

            quantity: {
                type: Number,
                default: 0,
            },
            avgBuyPrice: {
                type: Number,
                default: 0,
            }

        },
        ETH: {

            quantity: {
                type: Number,
                default: 0,
            },
            avgBuyPrice: {
                type: Number,
                default: 0,
            }
        },
        SOL: {
            quantity: {
                type: Number,
                default: 0,
            },
            avgBuyPrice: {
                type: Number,
                default: 0,
            }
        },
        DOGE: {
            quantity: {
                type: Number,
                default: 0
            },
            avgBuyPrice: {
                type: Number,
                default: 0
            },
        },
        ADA: {
            quantity: {
                type: Number,
                default: 0
            },
            avgBuyPrice: {
                type: Number,
                default: 0
            },
        },
        XRP: {
            quantity: {
                type: Number
                , default: 0
            },
            avgBuyPrice: {
                type: Number,
                default: 0
            },
        },
    },
    { timestamps: true }
);
const Portfolio = mongoose.model("Portfolio", PortfolioSchema);
export default Portfolio;