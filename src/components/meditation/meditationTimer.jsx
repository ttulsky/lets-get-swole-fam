import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Paper,
} from "@mui/material";

function MeditationTimer() {
  const [minutes, setMinutes] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showCompletionSnackbar, setShowCompletionSnackbar] = useState(false);
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState([]);

  const handleInputNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleSubmit = () => {
    if (note.trim() !== "") {
      const newLog = {
        content: note,
        dateTime: new Date(), // Store the current date and time
      };
      setLogs([...logs, newLog]);
      setNote(""); // Clear the input after submission
    }
  };

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
      <hr />
      <br />
      <Paper style={{ padding: 20, marginTop: 20, marginBottom: 20 }}>
        <Typography variant="h5" style={{ marginBottom: 20 }}>
          Meditation Notes
        </Typography>
        <TextField
          label="Meditation Notes"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={note}
          onChange={handleInputNoteChange}
          placeholder="Enter your reflections here..."
          style={{ marginBottom: 20 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Log
        </Button>
        <Typography variant="h6" style={{ marginTop: 20 }}>
          Your Logs:
        </Typography>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              <strong>Meditation | {formatDateTime(log.dateTime)}</strong>:{" "}
              {log.content}
            </li>
          ))}
        </ul>
      </Paper>
    </Container>
  );
}
function formatDateTime(dateTime) {
  return `${dateTime.toLocaleDateString("en-US", {
    weekday: "long", // "Monday"
    year: "numeric", // "2021"
    month: "long", // "July"
    day: "numeric", // "20"
  })} at ${dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default MeditationTimer;
