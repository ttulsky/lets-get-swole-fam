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
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useTheme } from "@mui/material/styles";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

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

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Fetch or create user data
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(firestore, "users", user.uid), {
          name: user.displayName,
          email: user.email,
        });
      }

      setSnackbarMessage("Login with Google successful!");
      setSnackbarOpen(true);
      localStorage.setItem("authToken", user.accessToken);
      navigate("/");
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setSnackbarMessage("Google sign-in failed. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setSnackbarMessage("Please enter your email address.");
      setSnackbarOpen(true);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSnackbarMessage("Password reset email sent!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Password reset failed:", error);
      setSnackbarMessage("Password reset failed. Please try again.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor:
            theme.palette.mode === "dark" ? "#333333" : "#ffffff",
          padding: 3,
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          sx={{ width: "100%", mt: 1 }}
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
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
            InputLabelProps={{
              style: { color: theme.palette.text.primary },
            }}
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
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
            InputLabelProps={{
              style: { color: theme.palette.text.primary },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Log In
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 1, mb: 1 }}
            onClick={handleOpen}
          >
            Sign Up
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 1, mb: 1 }}
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </Button>
          <Button
            type="button"
            fullWidth
            variant="text"
            color="primary"
            sx={{ mt: 1, mb: 1 }}
            onClick={handlePasswordReset}
          >
            Forgot Password?
          </Button>
        </Box>
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: theme.palette.mode === "dark" ? "#333333" : "#ffffff",
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
              InputProps={{
                style: { color: theme.palette.text.primary },
              }}
              InputLabelProps={{
                style: { color: theme.palette.text.primary },
              }}
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
              InputProps={{
                style: { color: theme.palette.text.primary },
              }}
              InputLabelProps={{
                style: { color: theme.palette.text.primary },
              }}
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
              InputProps={{
                style: { color: theme.palette.text.primary },
              }}
              InputLabelProps={{
                style: { color: theme.palette.text.primary },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 1, mb: 1 }}
              onClick={handleGoogleSignIn}
            >
              Sign up with Google
            </Button>
          </Box>
        </Modal>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Box>
    </Container>
  );
};

export default Login;
