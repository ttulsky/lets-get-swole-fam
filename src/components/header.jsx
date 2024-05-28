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

function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);

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

  const handleAuthAction = async () => {
    if (currentUser) {
      await logout();
      navigate("/"); // Redirect to home after logout
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
            Work Out Logs
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/mealLogs")}>
            Meal Logs
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/meditationTimer")}>
            Meditation Timer
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/resources")}>
            Swole Resources
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
        <Button color="inherit" onClick={handleAuthAction}>
          {currentUser ? "Log Out" : "Login"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
