import React, { useState, useEffect } from "react";
import "./Home.css";

function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // Initially set to false
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone
    ) {
      setIsInstalled(true);
    } else {
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsVisible(true); // Show the button if the app is not installed
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

  return (
    <div className="home-container">
      <div className="content">
        <h1>Welcome to Swole Wellness</h1>
        <p>
          Your ultimate resource for whole body wellness! Dive into a journey
          that nurtures your mind, body, and spirit. Whether you're pumping
          iron, finding inner peace, or building swole habits, we've got the
          tools and tips to elevate your physical, mental, emotional, and
          spiritual health. Let's get swole, fam!
        </p>
        <img src="../fitness.webp" className="App-logo" alt="logo" />
        {isInstalled ? (
          <p className="install-message"></p>
        ) : (
          isVisible && (
            <button onClick={handleAddToHomeScreen} className="a2hs-button">
              Download the App
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default Home;
