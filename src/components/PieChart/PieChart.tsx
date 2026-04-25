import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from "recharts";
import "./PieChart.scss";

interface ChartDataItem {
  category: string;
  amount: number;
}

interface ExpensePieChartProps {
  data: ChartDataItem[] | null | undefined;
}

const COLORS = [
  "#4F46E5",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#8B5CF6",
];

const ExpensePieChart = ({ data }: ExpensePieChartProps) => {
  const [outerRadius, setOuterRadius] = useState<number>(100);
  const [chartKey, setChartKey] = useState<number>(0);

  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 1200) {
        setOuterRadius(90);
      } else {
        setOuterRadius(100);
      }
      setChartKey((prev) => prev + 1);
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const chartData: ChartDataItem[] =
    !!(data && data.length > 0) ? (data as ChartDataItem[]) : [{ category: "No Expenses", amount: 1 }];

  const chartColors = !!(data && data.length > 0) ? COLORS : ["#E5E7EB"];

  const renderPieLabel = ({ value }: PieLabelRenderProps) => {
    return `$${value}`;
  };

  return (
    <div className="pie-chart">
      <div className="pie-chart__container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={outerRadius}
              label={!!(data && data.length > 0) ? renderPieLabel : false}
            >
              {chartData.map((_, index) => (
                // @ts-ignore - Recharts internal deprecation warning
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ marginTop: 20 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpensePieChart;
