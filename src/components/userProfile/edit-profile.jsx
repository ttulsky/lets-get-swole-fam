// src/components/EditProfile.js
import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Box,
} from "@mui/material";
import { auth, firestore } from "../../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AuthContext from "../../authContext";
import { useTheme } from "@mui/material/styles";
import "./profile.css";

const EditProfile = ({ onClose }) => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const theme = useTheme();

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(firestore, "users", currentUser.uid), userData);
      setSnackbarMessage("Profile updated successfully!");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbarMessage("Failed to update profile.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Box
      className="profile-modal"
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
      <Typography variant="h6" component="h2">
        Edit Profile
      </Typography>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Name"
        name="name"
        value={userData.name || ""}
        onChange={handleChange}
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Email"
        name="email"
        value={userData.email || ""}
        onChange={handleChange}
        disabled
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Age"
        name="age"
        value={userData.age || ""}
        onChange={handleChange}
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Height (cm)"
        name="height"
        value={userData.height || ""}
        onChange={handleChange}
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Weight (kg)"
        name="weight"
        value={userData.weight || ""}
        onChange={handleChange}
      />
      <FormControl variant="outlined" margin="normal" fullWidth>
        <InputLabel>Sex</InputLabel>
        <Select
          name="sex"
          value={userData.sex || ""}
          onChange={handleChange}
          label="Sex"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" margin="normal" fullWidth>
        <InputLabel>Fitness Goal</InputLabel>
        <Select
          name="fitnessGoal"
          value={userData.fitnessGoal || ""}
          onChange={handleChange}
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
        onClick={handleSave}
      >
        Save Changes
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default EditProfile;
