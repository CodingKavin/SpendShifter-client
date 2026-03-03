import { useState, useEffect } from "react";
import Typography from "../../components/Typography/Typography.jsx";
import Input from "../../components/Input/Input.jsx";
import SelectInput from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import "./DashboardPage.scss";
import api from "../../utils/axios.js";

const DashboardPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [dashData, setDashData] = useState({});
  const [budget, setBudget] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(
          `/dashboard?month=${month}&year=${year}`,
        );
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

  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const yearOptions = [
    { value: "2026", label: "2026" },
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" },
  ];

  const handleBudgetBlur = () => {
    if (!budget) return;

    const rounded = Math.round((Number(budget) + Number.EPSILON) * 100) / 100;
    setBudget(rounded.toFixed(2));
  };

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <Typography variant="h1">Dashboard</Typography>
        <div className="dashboard__month-select">
          <SelectInput
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            options={monthOptions}
            className="dashboard__select"
          />

          <SelectInput
            value={year}
            onChange={(e) => setYear(e.target.value)}
            options={yearOptions}
            className="dashboard__select"
          />
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter Amount"
            className="dashboard__input"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            onBlur={handleBudgetBlur}
          />
          <Button
            variant="primary"
            onClick={() => console.log("Save date clicked")}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="dashboard__card dashboard__card--budget">
        <Typography variant="h3">Monthly Budget</Typography>
        <div className="dashboard__budget-amount"></div>
        <Typography
          variant="p2"
          className="dashboard__budget-change"
        ></Typography>
      </div>

      <div className="dashboard__card dashboard__card--pie">
        <Typography variant="h3">Spending by Category</Typography>
        <div className="dashboard__pie-placeholder">
          {/* TODO: Replace with PieChart component */}
          <p>Pie Chart Here</p>
        </div>
      </div>

      <div className="dashboard__card dashboard__card--recent">
        <Typography variant="h3">Recent Transactions</Typography>
        <div className="dashboard__transactions">
          {/* TODO: Replace with recente transactions */}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
