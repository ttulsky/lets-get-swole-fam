import React from "react";
import {
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Input,
  Button,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MealInputList = ({
  mealType,
  input,
  suggestions,
  amounts,
  setInput,
  handleInputChange,
  handleAmountChange,
  addItem,
  deleteItem,
  items,
}) => {
  return (
    <>
      <Typography variant="h6">
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
                primary={`${item.food_name} (${item.amount})`}
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
