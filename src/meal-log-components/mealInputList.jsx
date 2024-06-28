import React from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Input,
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MealInputList = ({
  mealType,
  input,
  suggestions,
  amounts,
  units,
  setInput,
  handleInputChange,
  handleAmountChange,
  handleUnitChange,
  addItem,
  deleteItem,
  items,
}) => {
  return (
    <>
      <Typography variant="h6" sx={{ marginTop: 4 }}>
        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
      </Typography>
      <TextField
        label={`Add ${
          mealType.charAt(0).toUpperCase() + mealType.slice(1)
        } Item`}
        variant="outlined"
        fullWidth
        autoComplete="off"
        value={input}
        onChange={(event) => handleInputChange(event, mealType)}
        style={{ marginBottom: 20 }}
      />
      {suggestions.length > 0 && (
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
                    onChange={(e) => handleAmountChange(index, e.target.value)}
                    sx={{ width: 80, marginRight: 1 }}
                  />
                  <FormControl sx={{ minWidth: 120, marginRight: 1 }}>
                    <InputLabel id={`unit-label-${index}`}>Unit</InputLabel>
                    <Select
                      labelId={`unit-label-${index}`}
                      value={units[index] || "serving"}
                      onChange={(e) => handleUnitChange(index, e.target.value)}
                      label="Unit"
                    >
                      <MenuItem value="serving">Serving</MenuItem>
                      <MenuItem value="grams">Grams</MenuItem>
                      <MenuItem value="ounces">Ounces</MenuItem>
                      <MenuItem value="ml">Milliliters</MenuItem>
                      <MenuItem value="cups">Cups</MenuItem>
                      <MenuItem value="tbsp">Tablespoons</MenuItem>
                      <MenuItem value="tsp">Teaspoons</MenuItem>
                      <MenuItem value="L">Liters</MenuItem>
                      <MenuItem value="lbs">Pounds</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addItem(item, mealType, index)}
                  >
                    Add
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      {items.length > 0 && (
        <List>
          {items.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ListItemText
                primary={`${item.food_name} (${item.amount}${
                  item.unit !== "serving" ? ` ${item.unit}` : ""
                })`}
                secondary={`${item.calories} kcal`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteItem(mealType, index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default MealInputList;
