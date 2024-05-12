import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

function Footer() {
  return (
    <AppBar position="static" color="primary" className="App-footer">
      <Toolbar>
        <Typography variant="body1" color="inherit">
          &copy; {new Date().getFullYear()} Swole Soul
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
