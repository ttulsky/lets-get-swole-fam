import React, { useState, useEffect } from "react";
import { quotes } from "../quotes";
import { Modal, Box, Typography, useTheme } from "@mui/material";
import "./Home.css";
import { headlines } from "../headlines";

const Home = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [quote, setQuote] = useState("");
  const [headline, setHeadline] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone
    ) {
      setIsInstalled(true);
    } else {
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsVisible(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
      };
    }
  }, []);

  const handleAddToHomeScreen = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
        setIsVisible(false);
      });
    }
  };

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  const getRandomHeadline = () => {
    const randomIndex = Math.floor(Math.random() * headlines.length);
    return headlines[randomIndex];
  };

  const handleImageClick = () => {
    const randomQuote = getRandomQuote();
    const randomHeadline = getRandomHeadline();
    setQuote(randomQuote);
    setHeadline(randomHeadline);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="home-container">
      <div className="content">
        <h1>Welcome to Swole Wellness</h1>
        <p>
          Your ultimate resource for whole body wellness! Lets nurture your
          mind, body, and spirit. Whether you're pumping iron, finding inner
          peace, or building good habits, we've got the tools and tips to
          elevate your physical, mental, emotional, and spiritual health. Let's
          get swole, fam!
        </p>
        <div className="glowing-image">
          <img
            src="../fitness.png"
            className="App-logo"
            alt="logo"
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          />
        </div>
        {isInstalled ? (
          <p className="install-message"></p>
        ) : (
          isVisible && (
            <button onClick={handleAddToHomeScreen} className="a2hs-button">
              Download the App
            </button>
          )
        )}
        <Modal open={modalOpen} onClose={handleCloseModal}>
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
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6">{headline}</Typography>
            <Typography>{quote}</Typography>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
