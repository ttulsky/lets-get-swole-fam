// src/components/NewLandingPage.js
import React from "react";
import { Button, Container, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./lp.css";

const LP = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="new-landing-container">
      <Container maxWidth="md">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" className="title">
              Track your progress with Swole Wellness
            </Typography>

            <Typography variant="h5" className="subtitle">
              Build healthy habits with the all-in-one food, exercise, and
              calorie tracker!
            </Typography>
            <br />
            <Button variant="contained" color="primary" onClick={handleSignUp}>
              Start Today
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <img
              src={"../smartphone.png"}
              alt="App Mockup"
              className="lp-image"
            />
          </Grid>
        </Grid>
        <p>
          Your ultimate resource for whole body wellness! Whether you're hitting
          the gym, meditating, or building better habits, we've got the tools
          and tips to elevate your physical, mental, and emotional health. Let's
          get swole, fam!
        </p>
      </Container>
    </div>
  );
};

export default LP;
