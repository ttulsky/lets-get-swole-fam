// src/App.js
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./calendarStyles.css";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./components/home";
import Login from "./components/login";
import WorkoutLog from "./components/logs/workoutLog";
import MealLog from "./components/logs/mealLogs";
import MeditationTimer from "./components/meditation/meditationTimer";
import ContactUs from "./components/contact/contact";
import Resources from "./components/resources/resources";
import YogaResources from "./components/yoga/yoga";
import LP from "./components/lp/lp";
import SignUp from "./components/sign-Up/signUp";
import AuthContext from "./authContext";
import Profile from "./components/userProfile/profile";

function App() {
  const { currentUser } = useContext(AuthContext); // Get the current user from the context

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Navigate to="/home" /> : <LP />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/workoutLog" element={<WorkoutLog />} />
        <Route path="/mealLogs" element={<MealLog />} />
        <Route path="/meditationTimer" element={<MeditationTimer />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/yoga" element={<YogaResources />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
