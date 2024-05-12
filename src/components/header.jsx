import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Combine navigate and handleClose in one function
  const handleNavigate = (path) => {
    handleClose(); // Close the menu
    navigate(path); // Navigate after the menu has been closed
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleNavigate("/workoutLog")}>
            Work Out Logs
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/mealLogs")}>
            Meal Logs
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/meditationTimer")}>
            Meditation Timer
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/resources")}>
            Swole Fam Resources
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/contact")}>
            Contact
          </MenuItem>
        </Menu>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        <Button color="inherit" onClick={() => handleNavigate("/")}>
          Home
        </Button>
        <Button color="inherit" onClick={() => handleNavigate("/login")}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
