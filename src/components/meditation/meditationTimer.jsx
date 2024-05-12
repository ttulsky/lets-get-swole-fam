import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
} from "@mui/material";

function MeditationTimer() {
  const [minutes, setMinutes] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showCompletionSnackbar, setShowCompletionSnackbar] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((seconds) => seconds - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      playChime();
      setShowCompletionSnackbar(true); // Show completion Snackbar
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const handleInputChange = (e) => {
    setMinutes(e.target.value);
  };

  const handleStartTimer = () => {
    if (minutes > 0 && !isActive) {
      setSecondsRemaining(minutes * 60);
      setIsActive(true);
      setOpenSnackbar(true);
    }
  };

  const handleStopTimer = () => {
    setIsActive(false);
  };

  const handleResetTimer = () => {
    setMinutes("");
    setSecondsRemaining(0);
    setIsActive(false);
    setOpenSnackbar(false);
    setShowCompletionSnackbar(false);
  };

  const playChime = () => {
    const audio = new Audio("/chime.mp3");
    audio.play().catch((e) => console.error("Error playing sound:", e));
  };

  const formatTime = () => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCloseCompletionSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowCompletionSnackbar(false);
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Typography variant="h4" gutterBottom>
        Meditation Timer
      </Typography>
      <TextField
        label="Set Time (Minutes)"
        type="number"
        variant="outlined"
        value={minutes}
        onChange={handleInputChange}
        disabled={isActive}
        style={{ marginBottom: 20 }}
      />
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartTimer}
          disabled={!minutes || isActive}
        >
          Start
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleStopTimer}
          disabled={!isActive}
        >
          Stop
        </Button>
        <Button variant="outlined" onClick={handleResetTimer}>
          Reset
        </Button>
      </div>
      <Typography variant="h5" style={{ margin: "20px 0" }}>
        Time Remaining: {formatTime()}
      </Typography>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Enjoy your meditation"
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        style={{ top: "50%" }}
      />
      <Snackbar
        open={showCompletionSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseCompletionSnackbar}
        message="Namaste, my friend"
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        style={{ top: "50%" }}
      />
    </Container>
  );
}

export default MeditationTimer;
