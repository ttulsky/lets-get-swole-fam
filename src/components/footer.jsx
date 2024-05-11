import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

function Footer() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="body1" color="inherit">
          &copy; {new Date().getFullYear()} Swole Fam!
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
