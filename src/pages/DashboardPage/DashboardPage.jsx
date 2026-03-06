import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Typography from "../../components/Typography/Typography.jsx";
import Input from "../../components/Input/Input.jsx";
import SelectInput from "../../components/Input/SelectInput.jsx";
import Button from "../../components/Button/Button.jsx";
import PieChart from "../../components/PieChart/PieChart.jsx";
import "./DashboardPage.scss";
import api from "../../utils/axios.js";

const DashboardPage = () => {
  const [month, setMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0"),
  );
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [budget, setBudget] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentBudget, setCurrentBudget] = useState(0);
  const [currentSpending, setCurrentSpending] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [changePercent, setChangePercent] = useState(0);
  const [changeDirection, setChangeDirection] = useState("neutral");
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const monthNum = Number(month);
      const yearNum = Number(year);

      const summaryResp = await api.get(
        `/expenses/summary?month=${monthNum}&year=${yearNum}`,
      );
      const summary = summaryResp.data;
      setCurrentSpending(summary.total || 0);
      setCategoryData(summary.byCategory || []);

      const lastMonth = monthNum === 1 ? 12 : monthNum - 1;
      const lastMonthYear = monthNum === 1 ? yearNum - 1 : yearNum;

      const lastMonthResp = await api.get(
        `/expenses/summary?month=${lastMonth}&year=${lastMonthYear}`,
      );
      const lastMonthSpending = lastMonthResp.data.total || 0;

      let diffPercent = 0;
      if (lastMonthSpending === 0) diffPercent = summary.total > 0 ? 100 : 0;
      else
        diffPercent = Math.round(
          ((summary.total - lastMonthSpending) / lastMonthSpending) * 100,
        );

      setChangePercent(diffPercent);
      setChangeDirection(
        diffPercent > 0 ? "up" : diffPercent < 0 ? "down" : "neutral",
      );

      const budgetResp = await api.get(
        `/budgets?month=${monthNum}&year=${yearNum}`,
      );
      const fetchedBudget = budgetResp.data.budget?.amount ?? 0;
      setCurrentBudget(fetchedBudget);
      setBudget(fetchedBudget);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (month && year) fetchDashboardData();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const payload = {
        month: Number(month),
        year: Number(year),
        amount: Number(budget),
      };

      const response = await api.post("/budgets", payload);
      fetchDashboardData();
      console.log("Budget updated:", response.data);
      setCurrentBudget(response.data.budget.amount);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  let progressWidth =
    currentBudget > 0
      ? Math.min((currentSpending / currentBudget) * 100, 100)
      : 0;
  let progressStatus;

  if (currentSpending / currentBudget < 0.75) {
    progressStatus = "good";
  } else if (currentSpending / currentBudget < 1) {
    progressStatus = "warn";
  } else {
    progressStatus = "over";
  }

  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email || "User";

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <Typography variant="h1" className="dashboard__header-title">
          Welcome {userName}!
        </Typography>
        <form className="dashboard__form">
          <SelectInput
            label={<Typography variant="p1">Month</Typography>}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            options={monthOptions}
            className="dashboard__input dashboard__select"
          />

          <SelectInput
            label={<Typography variant="p1">Year</Typography>}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            options={yearOptions}
            className="dashboard__input dashboard__select"
          />
          <Input
            label={<Typography variant="p1">Budget</Typography>}
            type="number"
            min="0"
            placeholder="Enter Amount"
            className="dashboard__input"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            onBlur={handleBudgetBlur}
          />
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="dashboard__reset-btn"
          >
            <Typography variant="p2">Update Budget</Typography>
          </Button>
        </form>
      </div>

      <div className="dashboard__card dashboard__card--budget">
        <Typography variant="h2">Summary</Typography>
        <div className="dashboard__budget-summary-amount">
          <Typography variant="h3">Amount Spent:</Typography>
          <Typography variant="p1" className="dashboard__budget-spent">
            {`$${Number(currentSpending || 0).toFixed(2)}`}
          </Typography>
          <Typography variant="h3">Current Budget:</Typography>
          <Typography variant="p1" className="dashboard__budget-total">
            {`$${Number(currentBudget || 0).toFixed(2)}`}
          </Typography>
        </div>

        <div className="dashboard__budget-summary-progress">
          <div className="dashboard__budget-progress">
            <div
              className={`dashboard__budget-progress-fill dashboard__budget-progress-fill--${progressStatus}`}
              style={{ width: `${progressWidth}%` }}
            />
          </div>

          <Typography
            variant="p2"
            className={`dashboard__budget-change dashboard__budget-change--${changeDirection}`}
          >
            {changeDirection === "up"
              ? "↑"
              : changeDirection === "down"
                ? "↓"
                : ""}{" "}
            {Math.abs(changePercent)}% from last month
          </Typography>
        </div>
      </div>

      <div className="dashboard__card dashboard__card--pie">
        <Typography variant="h2">Spending by Category</Typography>
        <div className="dashboard__pie-chart">
          <PieChart
            data={categoryData.map((c) => ({
              category: c.category,
              amount: c.total,
            }))}
          />
        </div>
      </div>

      <div className="dashboard__go-expenses">
        <Button variant="primary" onClick={() => navigate("/expenses")}>
          <Typography variant="p2">Go to Expenses</Typography>
        </Button>
      </div>
    </section>
  );
};

export default DashboardPage;
