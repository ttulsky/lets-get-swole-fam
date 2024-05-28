import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/workoutLog" element={<WorkoutLog />} />
          <Route path="/mealLogs" element={<MealLog />} />
          <Route path="/meditationTimer" element={<MeditationTimer />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
