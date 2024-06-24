import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Input,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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

  const addItem = (item, mealType, index) => {
    const amount = parseFloat(amounts[index]) || 1;

    // Use regular expressions to find the relevant information
    const caloriesMatch = item.food_description.match(/(\d+(\.\d+)?)kcal/);
    const carbsMatch = item.food_description.match(/(\d+(\.\d+)?)g Carbs/);
    const fatMatch = item.food_description.match(/(\d+(\.\d+)?)g Fat/);
    const proteinMatch = item.food_description.match(/(\d+(\.\d+)?)g Protein/);

    // Extract values and set defaults if matches are not found
    const calories = caloriesMatch ? parseFloat(caloriesMatch[1]) : 0;
    const carbs = carbsMatch ? parseFloat(carbsMatch[1]) : 0;
    const fat = fatMatch ? parseFloat(fatMatch[1]) : 0;
    const protein = proteinMatch ? parseFloat(proteinMatch[1]) : 0;

    const newItem = {
      food_name: item.food_name,
      amount: amount,
      calories: (calories * amount).toFixed(2),
      carbs: (carbs * amount).toFixed(2),
      fat: (fat * amount).toFixed(2),
      protein: (protein * amount).toFixed(2),
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
  };

  const handleAmountChange = (index, value) => {
    const newAmounts = [...amounts];
    newAmounts[index] = value;
    setAmounts(newAmounts);
  };

  const deleteItem = (mealType, index) => {
    if (mealType === "breakfast") {
      setBreakfast((prev) => prev.filter((_, i) => i !== index));
    } else if (mealType === "lunch") {
      setLunch((prev) => prev.filter((_, i) => i !== index));
    } else if (mealType === "dinner") {
      setDinner((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setSnackbarMessage("Please log in to save your log.");
      setSnackbarOpen(true);
      return;
    }

    const newLog = {
      dateTime: Timestamp.fromDate(selectedDate), // Ensure dateTime is set correctly
      breakfast: breakfast,
      lunch: lunch,
      dinner: dinner,
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

    setSnackbarMessage("Log saved successfully.");
    setSnackbarOpen(true);
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

  const totalCalories = [...breakfast, ...lunch, ...dinner].reduce(
    (total, item) => total + parseFloat(item.calories),
    0
  );

  return (
    <Container component="main" maxWidth="md">
      <Paper style={{ padding: 20, marginTop: 20, marginBottom: 20 }}>
        <Typography variant="h5" style={{ marginBottom: 20 }}>
          Meal Logs
        </Typography>
        <LogCalendar logs={logs} onDateClick={handleDateClick} />
        <Typography variant="h6">
          Total Calories: {isNaN(totalCalories) ? 0 : totalCalories}
        </Typography>

        <Typography variant="h6">Breakfast</Typography>
        <TextField
          label="Add Breakfast Item"
          variant="outlined"
          fullWidth
          autoComplete="off"
          value={breakfastInput}
          onChange={(event) => handleInputChange(event, "breakfast")}
          style={{ marginBottom: 20 }}
        />
        {activeMeal === "breakfast" && suggestions.length > 0 && (
          <Paper style={{ maxHeight: 200, overflow: "auto", marginBottom: 20 }}>
            <List>
              {suggestions.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemText
                    primary={`${item.food_name}`}
                    secondary={`${item.food_description}`}
                    sx={{ maxWidth: "calc(100% - 100px)" }}
                  />
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 1,
                    }}
                  >
                    <Input
                      placeholder="Amount"
                      type="number"
                      step="0.1"
                      value={amounts[index] || ""}
                      onChange={(e) =>
                        handleAmountChange(index, e.target.value)
                      }
                      sx={{ width: 80, marginRight: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => addItem(item, "breakfast", index)}
                    >
                      Add
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
        {breakfast.length > 0 && (
          <List>
            {breakfast.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemText
                  primary={`${item.food_name} (${item.amount})`}
                  secondary={`${item.calories} kcal`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteItem("breakfast", index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}

        <Typography variant="h6">Lunch</Typography>
        <TextField
          label="Add Lunch Item"
          variant="outlined"
          fullWidth
          autoComplete="off"
          value={lunchInput}
          onChange={(event) => handleInputChange(event, "lunch")}
          style={{ marginBottom: 20 }}
        />
        {activeMeal === "lunch" && suggestions.length > 0 && (
          <Paper style={{ maxHeight: 200, overflow: "auto", marginBottom: 20 }}>
            <List>
              {suggestions.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemText
                    primary={`${item.food_name}`}
                    secondary={`${item.food_description}`}
                    sx={{ maxWidth: "calc(100% - 100px)" }}
                  />
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 1,
                    }}
                  >
                    <Input
                      placeholder="Amount"
                      type="number"
                      step="0.1"
                      value={amounts[index] || ""}
                      onChange={(e) =>
                        handleAmountChange(index, e.target.value)
                      }
                      sx={{ width: 80, marginRight: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => addItem(item, "lunch", index)}
                    >
                      Add
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
        {lunch.length > 0 && (
          <List>
            {lunch.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemText
                  primary={`${item.food_name} (${item.amount})`}
                  secondary={`${item.calories} kcal`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteItem("lunch", index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}

        <Typography variant="h6">Dinner</Typography>
        <TextField
          label="Add Dinner Item"
          variant="outlined"
          fullWidth
          autoComplete="off"
          value={dinnerInput}
          onChange={(event) => handleInputChange(event, "dinner")}
          style={{ marginBottom: 20 }}
        />
        {activeMeal === "dinner" && suggestions.length > 0 && (
          <Paper style={{ maxHeight: 200, overflow: "auto", marginBottom: 20 }}>
            <List>
              {suggestions.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemText
                    primary={`${item.food_name}`}
                    secondary={`${item.food_description}`}
                    sx={{ maxWidth: "calc(100% - 100px)" }}
                  />
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 1,
                    }}
                  >
                    <Input
                      placeholder="Amount"
                      type="number"
                      step="0.1"
                      value={amounts[index] || ""}
                      onChange={(e) =>
                        handleAmountChange(index, e.target.value)
                      }
                      sx={{ width: 80, marginRight: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => addItem(item, "dinner", index)}
                    >
                      Add
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
        {dinner.length > 0 && (
          <List>
            {dinner.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemText
                  primary={`${item.food_name} (${item.amount})`}
                  secondary={`${item.calories} kcal`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteItem("dinner", index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Log
        </Button>
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
