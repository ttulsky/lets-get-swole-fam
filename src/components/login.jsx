import React, { useState } from "react";
import { Button, TextField, Typography, Container } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Login attempt with:", email, password);
    // Here you will later add the Firebase login logic
  };

  return (
    <Container component="main" maxWidth="xs">
      <div
        style={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form
          style={{ width: "100%", marginTop: 1 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: "24px 0px 16px" }}
            onClick={handleLogin}
          >
            Log In
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: "24px 0px 16px" }}
            onClick={handleLogin}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default Login;
