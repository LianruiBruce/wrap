// App.js
import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import React, { useContext } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ThemeContext, ThemeProvider } from "./colorTheme/ThemeContext";
import ProtectedRoute from "./Components/ProtectedRoute"; // Import the ProtectedRoute component
import LogInPage from "./Pages/LogInPage";
import PageNotFound from "./Pages/PageNoFound";
import MainPage from "./Pages/Paperbase";
import ProfilePage from "./Pages/ProfilePage";
import HistoryPage from "./Pages/ReportLibrary";
import ResetPassword from "./Pages/ResetPage";
import SettingPage from "./Pages/SettingPage";
import SignUpPage from "./Pages/SignUpPage";
import VerificationCode from "./Pages/VerificationCodePage";
import LandingPage from "./Pages/LandingPage";

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { mode } = useContext(ThemeContext);

  const fontSize = JSON.parse(localStorage.getItem("fontSize")) || 16;

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            light: "#63a4ff",
            main: "rgb(178,178,178)",
            dark: "#004ba0",
            contrastText: "#2D3E4E",
          },
          secondary: {
            light: "#63a4ff",
            main: "rgb(178,178,178)",
            dark: "#004ba0",
            contrastText: "#2D3E4E",
          },
          background: {
            default: mode === "light" ? "#F5F5F5" : "#121212",
          },
        },
        typography: {
          fontFamily: '"Quicksand", sans-serif',
          h5: {
            fontWeight: 400,
            fontSize: "1.5rem",
            letterSpacing: "0.0075em",
          },
          body1: {
            fontSize: `${fontSize}px`,
            fontWeight: 300,
            lineHeight: 1.5,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiTab: {
            defaultProps: {
              disableRipple: true,
            },
            styleOverrides: {
              root: {
                textTransform: "none",
                margin: "0 16px",
                minWidth: 0,
                padding: 0,
                "&:hover": {
                  color: "#4fc3f7",
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === "light" ? "#fff" : "#181B1B",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
              },
              contained: {
                boxShadow: "none",
                "&:active": {
                  boxShadow: "none",
                },
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              root: {
                marginLeft: 8,
              },
              indicator: {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                backgroundColor: "#181B1B",
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                padding: 8,
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                borderRadius: 4,
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                backgroundColor: "#181B1B",
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                "&.Mui-selected": {
                  color: "#4fc3f7",
                },
              },
            },
          },
          MuiListItemText: {
            styleOverrides: {
              primary: {
                fontSize: 14,
                fontWeight: 500,
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                color: "inherit",
                minWidth: "auto",
                marginRight: 8,
                "& svg": {
                  fontSize: 20,
                },
              },
            },
          },
          MuiAvatar: {
            styleOverrides: {
              root: {
                width: 32,
                height: 32,
              },
            },
          },
        },
      }),
    [mode, fontSize]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/pagenotfound" element={<PageNotFound />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Protected routes */}
          <Route
            path="/mainpage"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="/verification-code" element={<VerificationCode />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
