import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Paper,
} from "@mui/material";
import LogModal from "../modal/modal";
import { firestore } from "../../firebase-config";
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore"; // Import Timestamp
import AuthContext from "../../authContext";
import "./meditation.css";

function MeditationTimer() {
  const { currentUser } = useContext(AuthContext);
  const [minutes, setMinutes] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showCompletionSnackbar, setShowCompletionSnackbar] = useState(false);
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      fetchLogs();
    }
  }, [currentUser]);

  const fetchLogs = async () => {
    if (currentUser) {
      const q = query(
        collection(firestore, `users/${currentUser.uid}/meditationLogs`)
      );
      const querySnapshot = await getDocs(q);
      const fetchedLogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        dateTime: doc.data().dateTime.toDate(), // Convert Timestamp to Date
      }));
      setLogs(fetchedLogs);
    }
  };

  const handleInputNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setSnackbarMessage("Please log in to add a log.");
      setSnackbarOpen(true);
      return;
    }

    if (note.trim() !== "") {
      const newLog = {
        content: note,
        dateTime: Timestamp.fromDate(new Date()), // Store as Timestamp
      };
      await addDoc(
        collection(firestore, `users/${currentUser.uid}/meditationLogs`),
        newLog
      );
      setNote("");
      fetchLogs(); // Refresh logs after adding a new one
    }
  };

  const handleOpenModal = (log) => {
    setSelectedLog(log);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLog(null);
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
    setSnackbarOpen(false);
    setOpenSnackbar(false);
    setShowCompletionSnackbar(false);
  };

  const handleCloseCompletionSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowCompletionSnackbar(false);
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <div className="grid-item">
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
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Enjoy your meditation"
        anchorOrigin={{ vertical: "center", horizontal: "center" }} // Center the Snackbar
        ContentProps={{}}
      />
      <Snackbar
        open={showCompletionSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseCompletionSnackbar}
        message="Namaste, my friend"
        anchorOrigin={{ vertical: "center", horizontal: "center" }} // Center the Snackbar
        ContentProps={{}}
      />

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
          {logs.map((log) => (
            <li key={log.id}>
              <Button onClick={() => handleOpenModal(log)}>
                Meditation | {formatDateTime(log.dateTime)}
              </Button>
            </li>
          ))}
        </ul>
      </Paper>
      <LogModal
        open={modalOpen}
        handleClose={handleCloseModal}
        date={selectedLog ? formatDateTime(selectedLog.dateTime) : ""}
        content={selectedLog ? selectedLog.content : ""}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "center", horizontal: "center" }} // Center the Snackbar
        ContentProps={{}}
      />
    </Container>
  );
}

function formatDateTime(dateTime) {
  return `${dateTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })} at ${dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default MeditationTimer;
