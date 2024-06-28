import React, { useState, useEffect, useContext } from "react";
import { Container, Typography, Paper, Snackbar, Box } from "@mui/material";
import LogCalendar from "../calendar/calendar";
import { firestore } from "../../firebase-config";
import {
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import AuthContext from "../../authContext";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import TotalAndMacroCards from "../../meal-log-components/totalAndMacroCards";
import MealInputList from "../../meal-log-components/mealInputList";

function MealLog() {
  const { currentUser } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [activeMeal, setActiveMeal] = useState("breakfast");
  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [breakfastInput, setBreakfastInput] = useState("");
  const [lunchInput, setLunchInput] = useState("");
  const [dinnerInput, setDinnerInput] = useState("");
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchLogs();
    }
  }, [currentUser]);

  useEffect(() => {
    const dateLogs = logs.filter(
      (log) =>
        log.dateTime &&
        log.dateTime.toDateString() === selectedDate.toDateString()
    );
    if (dateLogs.length > 0) {
      setBreakfast(dateLogs[0].breakfast || []);
      setLunch(dateLogs[0].lunch || []);
      setDinner(dateLogs[0].dinner || []);
    } else {
      setBreakfast([]);
      setLunch([]);
      setDinner([]);
    }
  }, [selectedDate, logs]);

  const fetchLogs = async () => {
    if (currentUser) {
      const q = query(
        collection(firestore, `users/${currentUser.uid}/mealLogs`)
      );
      const querySnapshot = await getDocs(q);
      const fetchedLogs = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dateTime: data.dateTime ? data.dateTime.toDate() : new Date(), // Ensure dateTime exists
        };
      });
      setLogs(fetchedLogs);
    }
  };

  const handleInputChange = async (event, mealType) => {
    setActiveMeal(mealType);
    const query = event.target.value;
    if (mealType === "breakfast") setBreakfastInput(query);
    if (mealType === "lunch") setLunchInput(query);
    if (mealType === "dinner") setDinnerInput(query);

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://us-central1-lets-get-swole-fam.cloudfunctions.net/calories?query=${query}`
      );
      setSuggestions(response.data.foods.food || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addItem = async (item, mealType, index) => {
    const amount = parseFloat(amounts[index]) || 1;

    // Ensure food description contains the necessary nutritional information
    const caloriesMatch = item.food_description.match(
      /Calories:\s*(\d+(\.\d+)?)/
    );
    const carbsMatch = item.food_description.match(/Carbs:\s*(\d+(\.\d+)?)/);
    const fatMatch = item.food_description.match(/Fat:\s*(\d+(\.\d+)?)/);
    const proteinMatch = item.food_description.match(
      /Protein:\s*(\d+(\.\d+)?)/
    );

    // Extract values and set defaults if matches are not found
    const calories = caloriesMatch ? parseFloat(caloriesMatch[1]) : 0;
    const carbs = carbsMatch ? parseFloat(carbsMatch[1]) : 0;
    const fat = fatMatch ? parseFloat(fatMatch[1]) : 0;
    const protein = proteinMatch ? parseFloat(proteinMatch[1]) : 0;

    const newItem = {
      food_name: item.food_name,
      amount: amount,
      calories: Math.round(calories * amount),
      carbs: Math.round(carbs * amount),
      fat: Math.round(fat * amount),
      protein: Math.round(protein * amount),
    };

    if (mealType === "breakfast") {
      setBreakfast((prev) => [...prev, newItem]);
      setBreakfastInput("");
    } else if (mealType === "lunch") {
      setLunch((prev) => [...prev, newItem]);
      setLunchInput("");
    } else if (mealType === "dinner") {
      setDinner((prev) => [...prev, newItem]);
      setDinnerInput("");
    }

    setSuggestions([]);
    setAmounts([]);

    await handleSubmit({
      breakfast: mealType === "breakfast" ? [...breakfast, newItem] : breakfast,
      lunch: mealType === "lunch" ? [...lunch, newItem] : lunch,
      dinner: mealType === "dinner" ? [...dinner, newItem] : dinner,
    });
  };

  const handleAmountChange = (index, value) => {
    const newAmounts = [...amounts];
    newAmounts[index] = value;
    setAmounts(newAmounts);
  };

  const deleteItem = async (mealType, index) => {
    let updatedBreakfast = breakfast;
    let updatedLunch = lunch;
    let updatedDinner = dinner;

    if (mealType === "breakfast") {
      updatedBreakfast = breakfast.filter((_, i) => i !== index);
      setBreakfast(updatedBreakfast);
    } else if (mealType === "lunch") {
      updatedLunch = lunch.filter((_, i) => i !== index);
      setLunch(updatedLunch);
    } else if (mealType === "dinner") {
      updatedDinner = dinner.filter((_, i) => i !== index);
      setDinner(updatedDinner);
    }

    await handleSubmit({
      breakfast: updatedBreakfast,
      lunch: updatedLunch,
      dinner: updatedDinner,
    });
  };

  const handleSubmit = async (updatedMeals) => {
    if (!currentUser) {
      setSnackbarMessage("Please log in to save your log.");
      setSnackbarOpen(true);
      return;
    }

    const newLog = {
      dateTime: Timestamp.fromDate(selectedDate), // Ensure dateTime is set correctly
      breakfast: updatedMeals?.breakfast || breakfast,
      lunch: updatedMeals?.lunch || lunch,
      dinner: updatedMeals?.dinner || dinner,
    };

    const dateLogs = logs.filter(
      (log) =>
        log.dateTime &&
        log.dateTime.toDateString() === selectedDate.toDateString()
    );

    if (dateLogs.length > 0) {
      // Update existing log
      const logId = dateLogs[0].id;
      const logRef = doc(firestore, `users/${currentUser.uid}/mealLogs`, logId);
      await updateDoc(logRef, newLog);
    } else {
      // Add new log
      await addDoc(
        collection(firestore, `users/${currentUser.uid}/mealLogs`),
        newLog
      );
    }

    fetchLogs();
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateLogs = logs.filter(
      (log) =>
        log.dateTime && log.dateTime.toDateString() === date.toDateString()
    );
    if (dateLogs.length > 0) {
      setBreakfast(dateLogs[0].breakfast || []);
      setLunch(dateLogs[0].lunch || []);
      setDinner(dateLogs[0].dinner || []);
    } else {
      setBreakfast([]);
      setLunch([]);
      setDinner([]);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const totalCalories = parseFloat(
    [...breakfast, ...lunch, ...dinner]
      .reduce((total, item) => total + parseFloat(item.calories), 0)
      .toFixed(1)
  );

  const totalCarbs = parseFloat(
    [...breakfast, ...lunch, ...dinner]
      .reduce((total, item) => total + parseFloat(item.carbs), 0)
      .toFixed(1)
  );

  const totalFat = parseFloat(
    [...breakfast, ...lunch, ...dinner]
      .reduce((total, item) => total + parseFloat(item.fat), 0)
      .toFixed(1)
  );

  const totalProtein = parseFloat(
    [...breakfast, ...lunch, ...dinner]
      .reduce((total, item) => total + parseFloat(item.protein), 0)
      .toFixed(1)
  );

  const macroData = [
    { name: "Carbs", value: totalCarbs },
    { name: "Fat", value: totalFat },
    { name: "Protein", value: totalProtein },
  ];

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
      }}
    >
      <Paper style={{ padding: 20, marginTop: 20, marginBottom: 20 }}>
        <Typography variant="h5" style={{ marginBottom: 20 }}>
          Meal Logs
        </Typography>
        <Typography variant="h6" align="center">
          {selectedDate.toDateString()}
        </Typography>
        <LogCalendar logs={logs} onDateClick={handleDateClick} />
        <TotalAndMacroCards
          totalCalories={totalCalories}
          totalCarbs={totalCarbs}
          totalFat={totalFat}
          totalProtein={totalProtein}
          macroData={macroData}
        />
        <MealInputList
          mealType="breakfast"
          input={breakfastInput}
          suggestions={suggestions}
          amounts={amounts}
          setInput={setBreakfastInput}
          handleInputChange={handleInputChange}
          handleAmountChange={handleAmountChange}
          addItem={addItem}
          deleteItem={deleteItem}
          items={breakfast}
        />
        <MealInputList
          mealType="lunch"
          input={lunchInput}
          suggestions={suggestions}
          amounts={amounts}
          setInput={setLunchInput}
          handleInputChange={handleInputChange}
          handleAmountChange={handleAmountChange}
          addItem={addItem}
          deleteItem={deleteItem}
          items={lunch}
        />
        <MealInputList
          mealType="dinner"
          input={dinnerInput}
          suggestions={suggestions}
          amounts={amounts}
          setInput={setDinnerInput}
          handleInputChange={handleInputChange}
          handleAmountChange={handleAmountChange}
          addItem={addItem}
          deleteItem={deleteItem}
          items={dinner}
        />
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      />
    </Container>
  );
}

export default MealLog;
