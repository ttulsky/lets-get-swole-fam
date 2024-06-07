// ThemeToggleButton.js
import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "../../themeContext";

const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Button
      variant="contained"
      onClick={toggleTheme}
      sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
    >
      {mode === "dark" ? "Light" : "Dark"} Mode
    </Button>
  );
};

export default ThemeToggleButton;
