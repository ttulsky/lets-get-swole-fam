import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600, // Increase the width
  bgcolor: "background.paper",
  border: "none", // Remove the border for a cleaner look
  boxShadow: 24,
  p: 4,
  borderRadius: 10, // Add rounded edges
};

const LogModal = ({ open, handleClose, date, content }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {date}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {content}
        </Typography>
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default LogModal;
