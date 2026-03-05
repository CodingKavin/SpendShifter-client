import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./PieChart.scss";

const sampleData = [
  { category: "Housing", amount: 1200 },
  { category: "Food", amount: 450 },
  { category: "Transportation", amount: 200 },
  { category: "Entertainment", amount: 150 },
  { category: "Other", amount: 100 },
];

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];

const ExpensePieChart = ({ data = sampleData }) => {
  return (
    <div className="pie-chart">
      <div className="pie-chart__container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpensePieChart;
