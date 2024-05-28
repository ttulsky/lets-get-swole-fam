import React, { useState, useEffect, useContext } from "react";
import { Button, TextField, Container, Typography, Paper } from "@mui/material";
import LogModal from "../modal/modal";
import LogCalendar from "../calendar/calendar";
import { firestore } from "../../firebase-config";
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore"; // Import Timestamp
import AuthContext from "../../authContext";

function WorkoutLog() {
  const { currentUser } = useContext(AuthContext);
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

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
    if (note.trim() !== "" && currentUser) {
      const newLog = {
        content: note,
        dateTime: Timestamp.fromDate(new Date()), // Store as Timestamp
      };
      await addDoc(
        collection(firestore, `users/${currentUser.uid}/workoutLogs`),
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
          {logs.map((log) => (
            <li key={log.id}>
              <Button onClick={() => handleOpenModal(log)}>
                Workout | {formatDateTime(log.dateTime)}
              </Button>
            </li>
          ))}
        </ul>
      </Paper>
      {/* <LogCalendar logs={logs} /> */}
      <LogModal
        open={modalOpen}
        handleClose={handleCloseModal}
        date={selectedLog ? formatDateTime(selectedLog.dateTime) : ""}
        content={selectedLog ? selectedLog.content : ""}
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

export default WorkoutLog;
