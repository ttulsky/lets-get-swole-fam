import React, { useState } from "react";
import { Button, TextField, Container, Typography, Paper } from "@mui/material";

function WorkoutLog() {
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState([]);

  const handleInputChange = (event) => {
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

  return (
    <Container component="main" maxWidth="md">
      <Paper style={{ padding: 20, marginTop: 20, marginBottom: 20 }}>
        <Typography variant="h5" style={{ marginBottom: 20 }}>
          Workout Logs
        </Typography>
        <TextField
          label="Workout Note"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={note}
          onChange={handleInputChange}
          placeholder="Enter your workout details here..."
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
              <strong>Workout | {formatDateTime(log.dateTime)}</strong>:{" "}
              {log.content}
            </li>
          ))}
        </ul>
      </Paper>
    </Container>
  );
}

// Helper function to format date and time
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

export default WorkoutLog;
