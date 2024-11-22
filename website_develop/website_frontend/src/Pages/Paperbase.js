// Paperbase.js
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  CssBaseline,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Content from "../Components/Content";
import Header from "../Components/Header";
import Navigator from "../Components/Navigator";
import ShortNavigator from "../Components/ShortNavigator";
import { ThemeContext } from "../colorTheme/ThemeContext";

export default function Paperbase() {
  const theme = useTheme();
  const { mode } = useContext(ThemeContext); // Global theme mode
  const [fontSize, setFontSize] = useState(
    JSON.parse(localStorage.getItem("fontSize")) || 16
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isShortNavigator, setIsShortNavigator] = useState(false);
  const [isDocumentSettingsClicked, setIsDocumentSettingsClicked] =
    useState(false);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isSmUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const drawerWidth = isShortNavigator ? 100 : 256;

  // Define background colors based on theme mode
  const mainBgColor = mode === "dark" ? "#1A1A1A" : "#ffffff";

  // Dark mode styles for Navigator and ShortNavigator
  const darkModeStyles = {
    backgroundColor: "#1A1A1A", // Dark background
    borderRight: "1px solid rgba(255, 255, 255, 0.05)", // Light border
  };

  const darkModeSecondary = {
    backgroundColor: "#1A1A1A", // Darker background for secondary elements
    borderRight: "1px solid rgba(255, 255, 255, 0.05)",
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const newFontSize = JSON.parse(localStorage.getItem("fontSize")) || 16;
      setFontSize(newFontSize);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://wrapcapstone.com/user-documents",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        setDocuments(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDocumentSettingsClick = () => {
    setIsDocumentSettingsClicked((prev) => !prev);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleNavigator = () => {
    setIsShortNavigator((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: mainBgColor, // Apply common background color
        color: theme.palette.text.primary,
      }}
    >
      <CssBaseline />

      {/* Navigator */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {!isSmUp && (
          <ShortNavigator
            PaperProps={{
              style: {
                width: drawerWidth,
                ...darkModeStyles, // Apply dark mode styles unconditionally
              },
            }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            documents={documents}
            isLoading={isLoading}
          />
        )}

        {isSmUp && (
          <>
            {isShortNavigator ? (
              <ShortNavigator
                PaperProps={{
                  style: {
                    width: drawerWidth,
                    ...darkModeSecondary, // Apply dark mode styles unconditionally
                  },
                }}
                documents={documents}
                isLoading={isLoading}
              />
            ) : (
              <Navigator
                PaperProps={{
                  style: {
                    width: drawerWidth,
                    ...darkModeSecondary, // Apply dark mode styles unconditionally
                  },
                }}
                documents={documents}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: mainBgColor, // Apply common background color
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Header */}
        <Header
          onDocumentSettingsClick={handleDocumentSettingsClick}
          isDocumentSettingsClicked={isDocumentSettingsClicked}
          toggleNavigator={toggleNavigator}
          isShortNavigator={isShortNavigator}
          backgroundColor={mainBgColor} // Pass background color to Header
        />

        {/* Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            backgroundColor: mainBgColor, // Apply common background color
          }}
        >
          {/* Scrollable Content */}
          <Box
            sx={{
              flexGrow: 1,
              height: "100%",
              overflowY: "auto",
              p: 3,
              "&::-webkit-scrollbar": {
                width: "8px",
                backgroundColor:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.05)",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.2)",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor:
                    mode === "dark"
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(0, 0, 0, 0.3)",
                },
              },
            }}
          >
            <Content isDocumentSettingsClicked={isDocumentSettingsClicked} />
          </Box>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            p: 2,
            backgroundColor: mainBgColor, // Apply common background color
            borderTop: `1px solid ${
              mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)"
            }`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: mode === "dark" ? "#B0B0B0" : theme.palette.text.secondary,
              textAlign: "center",
            }}
          >
            {"Copyright © "}
            <Link
              href="/privacy-policy"
              sx={{
                color: mode === "dark" ? "#90CAF9" : theme.palette.primary.main,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                  color:
                    mode === "dark" ? "#64B5F6" : theme.palette.primary.dark,
                },
              }}
            >
              Wrap
            </Link>{" "}
            {new Date().getFullYear()}.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
