import { useEffect, useState } from "react";
import api from "../services/api";

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get("auth/leaderboard");
                setLeaders(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">
                🏆 Leaderboard
            </h1>

            <div className="space-y-3">
                {leaders.map((user, index) => (
                    <div
                        key={index}
                        className="bg-slate-900 p-4 rounded-lg flex justify-between"
                    >
                        <span>
                            #{index + 1} {user.name}
                        </span>

                        <span>
                            ₹{user.totalValue.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;