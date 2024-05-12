import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./components/home";
import Login from "./components/login";
import WorkoutLog from "./components/logs/workoutLog";
import MealLog from "./components/logs/mealLogs";
import MeditationTimer from "./components/meditation/meditationTimer";

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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
