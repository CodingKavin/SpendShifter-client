import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Typography from "../../components/Typography/Typography.jsx";
import Input from "../../components/Input/Input.jsx";
import SelectInput from "../../components/Input/SelectInput.jsx";
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

  //   useEffect(() => {
  //     const fetchDashboard = async () => {
  //       try {
  //         setLoading(true);
  //         setError("");
  //         const response = await api.get(
  //           `/dashboard?month=${month}&year=${year}`,
  //         );
  //         setDashData(response.data);
  //       } catch (error) {
  //         setError(error.message || "Failed to load dashboard data");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     if (month && year) fetchDashboard();
  //   }, [month, year]);

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

      const response = await api.post("/budget", payload);

      console.log("Budget updated:", response.data);

      setDataDash((prev) => ({
        ...prev,
        monthlyBudget: payload.amount,
      }));
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  let currentBudget = 2500; //needs to be a state variable
  let currentSpending = 1100; // needs to be a state variable
  let progressWidth = Math.min((currentSpending / currentBudget) * 100, 100);
  let progressStatus;

  if (currentSpending / currentBudget < 0.75) {
    progressStatus = "good";
  } else if (currentSpending / currentBudget < 1) {
    progressStatus = "warn";
  } else {
    progressStatus = "over";
  }

  const { user } = useAuth();
  console.log("Supabase user object:", user);
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
            onClick={() => console.log("Save date clicked")}
            className="dashboard__reset-btn"
          >
            <Typography variant="p1">Reset</Typography>
          </Button>
        </form>
      </div>

      <div className="dashboard__card dashboard__card--budget">
        <Typography variant="h2">Summary</Typography>
        <div className="dashboard__budget-summary-amount">
          <Typography variant="h3">Current Budget</Typography>
          <Typography variant="p1" className="dashboard__budget-total">
            {`$${currentBudget}`}
          </Typography>
          <Typography variant="h3">Amount Spent</Typography>
          <Typography variant="p1" className="dashboard__budget-spent">
            {`$${currentSpending}`}
          </Typography>
        </div>

        <div className="dashboard__budget-summary-progress">
          <div className="dashboard__budget-progress">
            <div
              className="dashboard__budget-progress-fill"
              style={{ width: `${progressWidth}%` }}
            />
          </div>

          <Typography variant="p2" className="dashboard__budget-change">
            ↑ 8% from last month
          </Typography>
        </div>
      </div>

      <div className="dashboard__card dashboard__card--pie">
        <Typography variant="h2">Spending by Category</Typography>
        <div className="dashboard__pie-placeholder">
          {/* TODO: Replace with PieChart component */}
          <p>Pie Chart Here</p>
        </div>
      </div>

      <div className="dashboard__card dashboard__card--recent">
        <Typography variant="h2">Recent Transactions</Typography>
        <div className="dashboard__transactions">
          {/* TODO: Replace with recent transactions */}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
