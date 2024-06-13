import React, { useContext } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "../../themeContext";

const ThemeToggleButton = ({ currentMode }) => {
  const { toggleTheme } = useTheme();

  return (
    <Tooltip title={currentMode === "dark" ? "Light Mode" : "Dark Mode"}>
      <IconButton onClick={toggleTheme} color="inherit">
        {currentMode === "dark" ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;
