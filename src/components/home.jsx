import React, { useState, useEffect } from "react";
import { quotes } from "../quotes";
import "./Home.css";
import "./modal.css";

function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [quote, setQuote] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleImageClick = () => {
    const randomQuote = getRandomQuote();
    setQuote(randomQuote);
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
          Your ultimate resource for whole body wellness! Dive into a journey
          that nurtures your mind, body, and spirit. Whether you're pumping
          iron, finding inner peace, or building good habits, we've got the
          tools and tips to elevate your physical, mental, emotional, and
          spiritual health. Let's get swole, fam!
        </p>
        <div className="glowing-image">
          <img
            src="../fitness.webp"
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
        {modalOpen && (
          <div className="modal" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <p>{quote}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
