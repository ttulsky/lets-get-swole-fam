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
    window.scrollTo(0, 0);
  }, []);

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
      <div className="logo-container"></div>
      <div className="content">
        <div className="circle-container">
          {[
            {
              path: "/meditationTimer",
              icon: "../game-boy.png",
              label: "Meditation",
            },
            { path: "/contact", icon: "../Heart.png", label: "Contact" },
            {
              path: "/resources",
              icon: "../heart-drip-weight.png",
              label: "Resources",
            },
            { path: "/yoga", icon: "../yoga-meditate.png", label: "Yoga" },
            { path: "/workoutLog", icon: "../dumbell.png", label: "Workout" },
            { path: "/mealLogs", icon: "../apple.png", label: "Meals" },
          ].map((item, index) => (
            <div key={index} className={`nav-item icon${index + 1}`}>
              <div className="icon-wrapper">
                <IconButton
                  onClick={() => handleNavigate(item.path)}
                  className="glowing-image-icon"
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="icon-small-lp"
                  />
                </IconButton>
                <Typography variant="body2">{item.label}</Typography>
              </div>
            </div>
          ))}
        </div>

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
      <h3 className="subtitle">
        Build healthy habits with the all-in-one exercise, meditation, and meal
        tracker!
      </h3>
    </div>
  );
};

export default Home;
