import React, { useState, useEffect } from "react";
import { quotes } from "../quotes";
import {
  Modal,
  Box,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <div className="content">
        <div className="nav-links">
          <div className="nav-item">
            <Tooltip title="🏋️" placement="right">
              <IconButton
                onClick={() => handleNavigate("/workoutLog")}
                className="glowing-image-icon"
              >
                <img
                  src="../dumbell.png"
                  alt="Workout Logs"
                  className="icon-small-lp"
                />
              </IconButton>
              <Typography variant="body2">Workout</Typography>
            </Tooltip>
          </div>
          <div className="nav-item">
            <Tooltip title="🍎" placement="right">
              <IconButton
                onClick={() => handleNavigate("/mealLogs")}
                className="glowing-image-icon"
              >
                <img
                  src="../apple.png"
                  alt="Meal Logs"
                  className="icon-small-lp"
                />
              </IconButton>
              <Typography variant="body2">Meals</Typography>
            </Tooltip>
          </div>
          <div className="nav-item">
            <Tooltip title="🧘" placement="right">
              <IconButton
                onClick={() => handleNavigate("/meditationTimer")}
                className="glowing-image-icon"
              >
                <img
                  src="../game-boy.png"
                  alt="Meditation Timer"
                  className="icon-small-lp"
                />
              </IconButton>
              <Typography variant="body2">Meditate</Typography>
            </Tooltip>
          </div>
        </div>

        <p>
          Your ultimate resource for whole body wellness! Whether you're hitting
          the gym, meditating, or building better habits, we've got the tools
          and tips to elevate your physical, mental, and emotional health. Let's
          get swole, fam!
        </p>
        <Tooltip title="💭" placement="right">
          <div className="glowing-image">
            <img
              src="../fitness.png"
              className="App-logo"
              alt="logo"
              onClick={handleImageClick}
              style={{ cursor: "pointer" }}
            />
          </div>
        </Tooltip>
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
