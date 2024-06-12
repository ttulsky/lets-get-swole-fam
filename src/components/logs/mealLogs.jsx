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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogCalendar from "../calendar/calendar";
import { firestore } from "../../firebase-config";
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import AuthContext from "../../authContext";
import LogsModal from "../modal/modal";
import { useTheme } from "@mui/material/styles";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
  maxHeight: "80vh",
  overflowY: "auto",
};

function MealLog() {
  const { currentUser } = useContext(AuthContext);
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState([]);
  const [dateLogs, setDateLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [logDetailOpen, setLogDetailOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const theme = useTheme();

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
        userId: currentUser.uid, // Include userId
      };
      await addDoc(
        collection(firestore, `users/${currentUser.uid}/mealLogs`),
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
    setLogDetailOpen(true);
    setModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setLogDetailOpen(false);
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
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedLog && <Typography>{selectedLog.content}</Typography>}
        </Box>
      </Modal>

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
