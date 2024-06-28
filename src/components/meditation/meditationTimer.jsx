import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Paper,
  Modal,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import LogCalendar from "../calendar/calendar";
import { firestore } from "../../firebase-config";
import {
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import AuthContext from "../../authContext";
import LogsModal from "../modal/modal";
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
  const [dateLogs, setDateLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [logDetailOpen, setLogDetailOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editNote, setEditNote] = useState(""); // For editing log content
  const [isEditing, setIsEditing] = useState(false); // To track edit mode

  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date()); // New state for selected date

  const modalStyle = {
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
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        userId: currentUser.uid, // Include userId
      };
      await addDoc(
        collection(firestore, `users/${currentUser.uid}/meditationLogs`),
        newLog
      );
      setNote("");
      fetchLogs(); // Refresh logs after adding a new one
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date); // Update selected date
    const dateLogs = logs.filter(
      (log) => log.dateTime.toDateString() === date.toDateString()
    );
    setDateLogs(dateLogs);
    if (dateLogs.length > 0) {
      setModalOpen(true); // Only open the modal if there are logs for the selected date
    }
  };

  const handleOpenLogDetail = (log) => {
    setSelectedLog(log);
    setEditNote(log.content); // Set edit note to the current log content
    setLogDetailOpen(true);
    setModalOpen(false); // Close the first modal when opening the log detail modal
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setLogDetailOpen(false);
    setSelectedLog(null);
    setIsEditing(false); // Exit edit mode on modal close
  };

  const handleEditNoteChange = (event) => {
    setEditNote(event.target.value);
  };

  const handleUpdateLog = async () => {
    if (selectedLog && editNote.trim() !== "") {
      const logRef = doc(
        firestore,
        `users/${currentUser.uid}/meditationLogs`,
        selectedLog.id
      );
      await updateDoc(logRef, {
        content: editNote,
        dateTime: selectedLog.dateTime, // Preserve the original dateTime
      });
      setSnackbarMessage("Log updated successfully.");
      setSnackbarOpen(true);
      setLogDetailOpen(false);
      setIsEditing(false); // Exit edit mode after updating
      fetchLogs(); // Refresh logs after updating
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
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
    const audio = new Audio("/chime-2.mp3");
    audio.load();
    audio.play().catch((e) => console.error("Error playing sound:", e));
  };

  const formatTime = () => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Paper>
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
      </Paper>
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

      <Paper
        style={{
          padding: 20,
          marginTop: 20,
          marginBottom: 20,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
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
        <Typography variant="h6" align="center" style={{ marginTop: 20 }}>
          {selectedDate.toDateString()}
        </Typography>
        <LogCalendar logs={logs} onDateClick={handleDateClick} />
      </Paper>

      <LogsModal
        open={modalOpen}
        handleClose={handleCloseModal}
        logs={dateLogs}
        onLogClick={handleOpenLogDetail}
      />

      <Modal open={logDetailOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              {selectedLog && formatDateTime(selectedLog.dateTime)}
            </Typography>
            <div>
              <IconButton onClick={handleEditClick} disabled={isEditing}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </div>
          </Box>
          {selectedLog && !isEditing && (
            <Typography>{selectedLog.content}</Typography>
          )}
          {selectedLog && isEditing && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Edit Log:
              </Typography>
              <TextField
                value={editNote}
                onChange={handleEditNoteChange}
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                style={{ marginBottom: 20 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateLog}
              >
                Update Log
              </Button>
            </Box>
          )}
        </Box>
      </Modal>

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
