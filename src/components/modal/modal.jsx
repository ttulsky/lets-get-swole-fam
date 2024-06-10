import React from "react";
import { Modal, Button, Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

const LogsModal = ({ open, handleClose, logs, onLogClick }) => {
  const theme = useTheme();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%", // Use percentage to make it responsive
    maxWidth: 600, // Max width for larger screens
    bgcolor: theme.palette.mode === "dark" ? "#333333" : "#ffffff",
    border: "none", // Remove the border for a cleaner look
    boxShadow: 24,
    p: 4,
    borderRadius: 10, // Add rounded edges
    maxHeight: "80vh", // Set a max height for the modal
    overflowY: "auto", // Enable vertical scrolling
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="logs-modal-title"
      aria-describedby="logs-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography id="logs-modal-title" variant="h6">
            Logs
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
          <ul style={{ padding: 0, listStyle: "none" }}>
            {logs &&
              logs.map(
                (log) =>
                  log && (
                    <li key={log.id}>
                      <Button
                        onClick={() => onLogClick(log)}
                        style={{
                          display: "block",
                          textAlign: "left",
                          width: "100%",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {`${formatDateTime(log.dateTime)}`}
                      </Button>
                    </li>
                  )
              )}
          </ul>
        </Box>
      </Box>
    </Modal>
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

export default LogsModal;
