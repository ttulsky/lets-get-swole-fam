import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import MacrosPieChart from "../components/pieChart/pieChart";

const TotalAndMacroCards = ({
  totalCalories,
  totalCarbs,
  totalFat,
  totalProtein,
  macroData,
}) => {
  return (
    <Box sx={{ marginTop: 2 }}>
      <Card
        sx={{
          backgroundColor: "background.default",
          marginBottom: 2,
        }}
      >
        <CardContent>
          <Typography variant="h6">
            Total Calories: {isNaN(totalCalories) ? 0 : totalCalories}
          </Typography>
          <Typography variant="h6">
            Total Carbs: {isNaN(totalCarbs) ? 0 : totalCarbs}g
          </Typography>
          <Typography variant="h6">
            Total Fat: {isNaN(totalFat) ? 0 : totalFat}g
          </Typography>
          <Typography variant="h6">
            Total Protein: {isNaN(totalProtein) ? 0 : totalProtein}g
          </Typography>
        </CardContent>
      </Card>
      <Card
        sx={{
          backgroundColor: "background.default",
          marginBottom: 2,
        }}
      >
        <CardContent>
          <Typography variant="h6">Macro Percentages</Typography>
          <MacrosPieChart data={macroData} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default TotalAndMacroCards;
