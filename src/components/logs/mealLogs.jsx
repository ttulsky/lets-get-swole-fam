import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Snackbar,
} from "@mui/material";
import LogModal from "../modal/modal";
import LogCalendar from "../calendar/calendar";
import { firestore } from "../../firebase-config";
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import AuthContext from "../../authContext";

function MealLog() {
  const { currentUser } = useContext(AuthContext);
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
        collection(firestore, `users/${currentUser.uid}/mealLogs`)
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
      };
      await addDoc(
        collection(firestore, `users/${currentUser.uid}/mealLogs`),
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper style={{ padding: 20, marginTop: 20, marginBottom: 20 }}>
        <Typography variant="h5" style={{ marginBottom: 20 }}>
          Meal Logs
        </Typography>
        <TextField
          label="Meal Notes"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={note}
          onChange={handleInputChange}
          placeholder="Enter your meal details here..."
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
                Meal | {formatDateTime(log.dateTime)}
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
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "center", horizontal: "center" }} // Center the Snackbar
      />
    </Container>
  );
}

// Helper function to format date and time
function formatDateTime(dateTime) {
  return `${new Date(dateTime).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })} at ${new Date(dateTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default MealLog;
