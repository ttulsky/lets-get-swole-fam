import React, { useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import AuthContext from "../authContext";
import "./header.css";

function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const { currentUser, userName, logout } = useContext(AuthContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  const handleAuthAction = () => {
    if (currentUser) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
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
            <img src="../dumbell.png" alt="logo" className="icon-small" />
            Work Out Logs{" "}
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/mealLogs")}>
            <img src="../apple.png" alt="logo" className="icon-small" />
            Meal Logs
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/meditationTimer")}>
            <img src="../game-boy.png" alt="logo" className="icon-small" />
            Meditation Timer
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/yoga")}>
            <img src="../yoga-meditate.png" alt="logo" className="icon-small" />
            Yoga Practice
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/resources")}>
            <img
              src="../heart-drip-weight.png"
              alt="logo"
              className="icon-small"
            />
            Wellness Resources
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/contact")}>
            <img src="../Heart.png" alt="logo" className="icon-small" />
            Contact
          </MenuItem>
        </Menu>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        {currentUser && (
          <Typography
            variant="h6"
            component="div"
            sx={{ marginRight: 2 }}
            className="welcome-message"
          >
            Welcome back {userName}!
          </Typography>
        )}
        <Button color="inherit" onClick={() => handleNavigate("/")}>
          Home
        </Button>
        <Button color="inherit" onClick={handleAuthAction}>
          {currentUser ? "Log Out" : "Login"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
