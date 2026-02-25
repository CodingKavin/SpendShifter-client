import { useState, useEffect } from "react";
import Typography from "../../components/Typography/Typography.jsx";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button.jsx";
import "./Dashboard.scss";
import api from "../../utils/axios.js";

const DashboardPage = () => {

    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [dashData, setDashData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.get(`/dashboard?month=${month}&year=${year}`)
                setDashData(response.data);
            } catch (error) {
                setError(error.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        if (month && year) fetchDashboard();
    }, [month, year]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="dashboard">
            <div className="dashboard__header">
                <Typography variant="h1">Dashboard</Typography>
                <div className="dashboard__month-select">
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="dashboard__select"
                    >
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>

                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="dashboard__select"
                    >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                    </select>
                </div>
            </div>
            <div>

            </div>
        </section>
    );
}