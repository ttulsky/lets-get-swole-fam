import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Typography, Box } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const text = `${Math.round(percent * 100)}%`;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {text}
    </text>
  );
};

const MacrosPieChart = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  const pieData = data.map((item) => ({
    name: item.name,
    value: item.value,
    percentage: ((item.value / total) * 100).toFixed() + "%",
  }));

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomizedLabel}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {pieData.map((entry, index) => (
          <Box
            key={`legend-${index}`}
            sx={{ display: "flex", alignItems: "center", mr: 2 }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: COLORS[index % COLORS.length],
                mr: 1,
              }}
            />
            <Typography>{entry.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MacrosPieChart;
