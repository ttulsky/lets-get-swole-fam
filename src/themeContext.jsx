import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyles } from "@mui/system";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode ? savedMode : "dark";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          background: {
            default: mode === "dark" ? "#121212" : "#ffffff",
            paper: mode === "dark" ? "#1f1f1f" : "#ffffff",
          },
          primary: {
            main: mode === "dark" ? "#90CAF9" : "#1976D2",
          },
          text: {
            primary: mode === "dark" ? "#ffffff" : "#000000",
            secondary: mode === "dark" ? "#b0bec5" : "#757575",
          },
        },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                "&:-webkit-autofill": {
                  transition: "background-color 5000s ease-in-out 0s",
                  WebkitBoxShadow: "0 0 0 1000px inherit inset !important",
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              containedPrimary: {
                backgroundColor: mode === "dark" ? "#90CAF9" : undefined,
              },
            },
          },
        },
      }),
    [mode]
  );

  const globalStyles = (
    <GlobalStyles
      styles={{
        body: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
        "::placeholder": {
          color: theme.palette.text.secondary,
        },
        "input:-webkit-autofill": {
          WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
          WebkitTextFillColor: `${theme.palette.text.primary} !important`,
        },
      }}
    />
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
