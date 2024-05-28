// import React from "react";
// import "./contact.css";

// const Contact = () => {
//   return (
//     <div>
//       <h1>Want more Swole info?</h1>
//       <div className="page-container">
//         <div className="contact-container grid-item">
//           <h2>Contact Us!</h2>
//           <p>
//             If you have any questions or would like to get in touch, feel free
//             to reach out, and someone from our Swole Fam will hit you back!
//           </p>
//           <div className="contact-info">
//             <p>
//               <a href="mailto:letsgetswolefam@gmail.com">
//                 letsgetswolefam@gmail.com
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;
import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import "./contact.css"; // Ensure you have a CSS file for styling

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        e.target,
        process.env.REACT_APP_EMAILJS_USER_ID
      )
      .then(() => {
        setIsSent(true);
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch((err) => {
        console.error("Failed to send message: ", err);
      });
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper style={{ padding: 20, marginTop: 20, marginBottom: 20 }}>
        <Typography variant="h5" style={{ marginBottom: 20 }}>
          Contact Us
        </Typography>
        <form onSubmit={sendEmail}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: 20 }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: 20 }}
          />
          <TextField
            label="Message"
            name="message"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ marginBottom: 20 }}
          />
          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
        </form>
        {isSent && (
          <Typography variant="h6" style={{ marginTop: 20 }}>
            Thank you, your message has been received. We'll be in touch soon!
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Contact;
