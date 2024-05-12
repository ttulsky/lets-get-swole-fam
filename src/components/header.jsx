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

  const handleLogin = () => {
    navigate("/login"); // Navigate to the login page
  };
  const handleHome = () => {
    navigate("/"); // Navigate to the login page
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
          <MenuItem onClick={handleClose}>Work Out Logs</MenuItem>
          <MenuItem onClick={handleClose}>Meal Logs</MenuItem>
          <MenuItem onClick={handleClose}>Meditation Timer</MenuItem>
          <MenuItem onClick={handleClose}>Swole Fam Resources</MenuItem>
          <MenuItem onClick={handleClose}>Contact</MenuItem>
        </Menu>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        <Button color="inherit" onClick={handleHome}>
          Home
        </Button>
        <Button color="inherit" onClick={handleLogin}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
