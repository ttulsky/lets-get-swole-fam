import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthContext from "../authContext";
import ThemeToggleButton from "./toggle/ThemeToggleButton";
import "./header.css";
import { useTheme } from "../themeContext";

function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userName, profileImageURL, logout } =
    useContext(AuthContext);
  const { mode } = useTheme();

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

  const handleAvatarClick = () => {
    if (location.pathname === "/profile") {
      navigate("/home");
    } else {
      navigate("/profile");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar className="toolbar">
        <div className="left-section">
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
            sx={{ "& .MuiPaper-root": { width: "210px" } }}
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
              <img
                src="../yoga-meditate.png"
                alt="logo"
                className="icon-small"
              />
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
          <ThemeToggleButton currentMode={mode} />
          <Tooltip title="Home">
            <Typography
              variant="h6"
              component={Link}
              to="/home"
              className="swole-wellness"
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              Swole Wellness
            </Typography>
          </Tooltip>
        </div>
        <div className="right-section">
          <Tooltip
            title={location.pathname === "/profile" ? "Home" : "My Profile"}
          >
            <Button onClick={handleAvatarClick}>
              {profileImageURL ? (
                <Avatar
                  src={profileImageURL}
                  alt="Profile"
                  className="icon-small"
                />
              ) : (
                <Avatar className="icon-small">{userName?.charAt(0)}</Avatar>
              )}
            </Button>
          </Tooltip>
          <Button color="inherit" onClick={handleAuthAction}>
            {currentUser ? "Log Out" : "Login"}
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
