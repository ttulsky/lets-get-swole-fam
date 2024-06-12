// src/components/SignUp.js
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Modal,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../firebase-config";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import "./signup.css";

const SignUp = () => {
  const [open, setOpen] = useState(true); // Modal open state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClose = () => {
    if (
      !name ||
      !email ||
      !password ||
      !age ||
      !height ||
      !weight ||
      !sex ||
      !fitnessGoal
    ) {
      navigate("/login");
    } else {
      setOpen(false);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

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
        age: parseInt(age),
        height: parseInt(height),
        weight: parseInt(weight),
        sex,
        fitnessGoal,
      });

      setSnackbarMessage("Sign-up successful! Please log in.");
      setSnackbarOpen(true);
      setOpen(false);
      navigate("/login");
    } catch (error) {
      setSnackbarMessage("Sign-up failed. Please try again.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        className="signup-modal"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 600,
          bgcolor: theme.palette.mode === "dark" ? "#333333" : "#ffffff",
          border: "none",
          boxShadow: 24,
          p: 4,
          borderRadius: 10,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ color: theme.palette.text.primary }}
        >
          Sign Up
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email"
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <FormControl variant="outlined" margin="normal" fullWidth required>
          <InputLabel>Sex</InputLabel>
          <Select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            label="Sex"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" margin="normal" fullWidth required>
          <InputLabel>Fitness Goal</InputLabel>
          <Select
            value={fitnessGoal}
            onChange={(e) => setFitnessGoal(e.target.value)}
            label="Fitness Goal"
          >
            <MenuItem value="Lose Weight">Lose Weight</MenuItem>
            <MenuItem value="Gain Muscle">Gain Muscle</MenuItem>
            <MenuItem value="Increase Endurance">Increase Endurance</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSignUp}
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Box>
    </Modal>
  );
};

export default SignUp;
