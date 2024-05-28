import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Modal,
  Box,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user data
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (userDoc.exists()) {
        console.log("User data:", userDoc.data());
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);

        // Store authentication token
        localStorage.setItem("authToken", user.accessToken);

        navigate("/");
      } else {
        console.log("No user data found!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setSnackbarMessage(
        "Login failed. Please check your credentials and try again."
      );
      setSnackbarOpen(true);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data
      await setDoc(doc(firestore, "users", user.uid), {
        name,
        email,
      });

      handleClose();
      setIsSent(true);
      setName("");
      setEmail("");
      setPassword("");
      setSnackbarMessage("Sign-up successful! Please log in.");
      setSnackbarOpen(true);
      console.log("Sign-up successful!");
    } catch (error) {
      console.error("Sign-up failed:", error);
      setSnackbarMessage("Sign-up failed. Please try again.");
      setSnackbarOpen(true);
    }
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
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: "24px 0px 16px" }}
            onClick={handleOpen}
          >
            Sign Up
          </Button>
        </form>
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              Sign Up
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
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
              fullWidth
              variant="contained"
              color="primary"
              style={{ margin: "24px 0px 16px" }}
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </Box>
        </Modal>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </div>
    </Container>
  );
};

export default Login;
