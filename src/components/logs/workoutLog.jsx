import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Snackbar,
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

const WorkoutLog = () => {
  const { currentUser } = useContext(AuthContext);
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
        collection(firestore, `users/${currentUser.uid}/workoutLogs`)
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

  const handleInputChange = (event) => {
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
        collection(firestore, `users/${currentUser.uid}/workoutLogs`),
        newLog
      );
      setNote("");
      fetchLogs(); // Refresh logs after adding a new one
    }
  };

  const handleDateClick = (date) => {
    const dateLogs = logs.filter(
      (log) => log.dateTime.toDateString() === date.toDateString()
    );
    setDateLogs(dateLogs);
    setModalOpen(true);
  };

  const handleOpenLogDetail = (log) => {
    setSelectedLog(log);
    setEditNote(log.content); // Set edit note to the current log content
    setLogDetailOpen(true);
    setModalOpen(false);
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
        `users/${currentUser.uid}/workoutLogs`,
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
        <LogCalendar logs={logs} onDateClick={handleDateClick} />
      </Paper>

      <LogsModal
        open={modalOpen}
        handleClose={handleCloseModal}
        logs={dateLogs}
        onLogClick={handleOpenLogDetail}
      />

      <Modal open={logDetailOpen} onClose={handleCloseModal}>
        <Box
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
      />
    </Container>
  );
};

// Helper function to format date and time
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

export default WorkoutLog;
