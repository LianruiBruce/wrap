// SettingPage.js
import React, { useEffect, useState, useContext } from "react";
import ShortNavigator from "../Components/ShortNavigator";
import { Switch, FormControlLabel } from "@mui/material";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Slider,
  Typography,
} from "@mui/material";
import { ThemeContext } from "../colorTheme/ThemeContext";

export default function SettingPage() {
  // Initialize state from localStorage or provide default values
  const [numberOfSections, setNumberOfSections] = useState(
    JSON.parse(localStorage.getItem("numberOfSections")) || 3
  );
  const [summaryLength, setSummaryLength] = useState(
    JSON.parse(localStorage.getItem("summaryLength")) || 100
  );
  const [reportSpeed, setReportSpeed] = useState(
    JSON.parse(localStorage.getItem("reportSpeed")) || 4
  );
  const [fontSize, setFontSize] = useState(
    JSON.parse(localStorage.getItem("fontSize")) || 16
  );

  const { mode, setMode } = useContext(ThemeContext);

  // State to track unsaved changes
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Function to save settings to localStorage and backend
  const handleSave = () => {
    const settings = {
      numberOfSections,
      summaryLength,
      reportSpeed,
      fontSize,
      colorMode: mode,
    };

    // Save settings to localStorage
    localStorage.setItem("numberOfSections", JSON.stringify(numberOfSections));
    localStorage.setItem("summaryLength", JSON.stringify(summaryLength));
    localStorage.setItem("reportSpeed", JSON.stringify(reportSpeed));
    localStorage.setItem("fontSize", JSON.stringify(fontSize)); // Save font size
    localStorage.setItem("colorMode", mode); // Save color mode from context

    console.log("Settings saved:", settings);

    // Send the settings to the backend
    fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Settings successfully saved to the server");
          // Reset unsaved changes after successful save
          setUnsavedChanges(false);
        } else {
          console.error("Failed to save settings to the server");
        }
      })
      .catch((error) => {
        console.error("Error sending settings to the server:", error);
      });
  };

  // Function to reset settings and save immediately
  const resetSettings = () => {
    const userToken = localStorage.getItem("userToken");

    // Reset state variables to default values
    setNumberOfSections(3);
    setSummaryLength(100);
    setReportSpeed(4);
    setFontSize(16);
    setMode("light"); // Reset to light mode

    // Save the reset settings immediately to localStorage
    localStorage.setItem("numberOfSections", JSON.stringify(3));
    localStorage.setItem("summaryLength", JSON.stringify(100));
    localStorage.setItem("reportSpeed", JSON.stringify(4));
    localStorage.setItem("fontSize", JSON.stringify(16));
    localStorage.setItem("colorMode", "light"); // Save light mode

    // Send the reset settings to the backend
    const settings = {
      numberOfSections: 3,
      summaryLength: 100,
      reportSpeed: 4,
      fontSize: 16,
      colorMode: "light", // Reset to light
    };

    fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Settings successfully reset on the server");
        } else {
          console.error("Failed to reset settings on the server");
        }
      })
      .catch((error) => {
        console.error("Error resetting settings on the server:", error);
      });

    // Reset unsaved changes
    setUnsavedChanges(false);

    if (userToken) {
      localStorage.setItem("userToken", userToken);
    }
    console.log("Settings reset, token preserved.");
  };

  // Prompt user before leaving the page if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  // Marks for the number of sections slider
  const sectionMarks = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];

  // Marks for the summary length slider
  const summaryMarks = [
    { value: 100, label: "100" },
    { value: 150, label: "150" },
    { value: 200, label: "200" },
    { value: 250, label: "250" },
  ];

  // Marks for the report speed slider (1 is fast, 8 is precise)
  const speedMarks = [
    { value: 1, label: "Fast" },
    { value: 8, label: "Precise" },
  ];

  // Marks for font size slider
  const fontSizeMarks = [
    { value: 12, label: "12px" },
    { value: 14, label: "14px" },
    { value: 16, label: "16px" },
    { value: 18, label: "18px" },
    { value: 20, label: "20px" },
    { value: 24, label: "24px" },
  ];

  const handleColorModeChange = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("colorMode", newMode);
    setUnsavedChanges(true);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Add ShortNavigator to the left */}
      <ShortNavigator />

      {/* Settings content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          padding: "20px",
          backgroundColor: "background.default",
        }}
      >
        <Card sx={{ maxWidth: 800, width: "100%", padding: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" sx={{ mb: 3 }}>
              User Settings
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Report Settings
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">Number of Sections</Typography>
                <Slider
                  value={numberOfSections}
                  min={3}
                  max={5}
                  marks={sectionMarks}
                  step={1}
                  onChange={(e, newValue) => {
                    setNumberOfSections(newValue);
                    setUnsavedChanges(true);
                  }}
                  aria-labelledby="sections-slider"
                  sx={{ mt: 2 }}
                />
              </Grid>
              {/* Add Divider */}
              <Divider sx={{ my: 2 }} />
              <Grid item xs={12}>
                <Typography variant="body1">Summary Length</Typography>
                <Slider
                  value={summaryLength}
                  min={100}
                  max={250}
                  marks={summaryMarks}
                  step={null}
                  onChange={(e, newValue) => {
                    setSummaryLength(newValue);
                    setUnsavedChanges(true);
                  }}
                  aria-labelledby="summary-length-slider"
                  sx={{ mt: 2 }}
                />
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  Current summary length: {summaryLength} words
                </Typography>
              </Grid>
              {/* Add Divider */}
              <Divider sx={{ my: 2 }} />
              <Grid item xs={12}>
                <Typography variant="body1">
                  Report Speed (1 = Fast, 8 = Precise)
                </Typography>
                <Slider
                  value={reportSpeed}
                  min={1}
                  max={8}
                  marks={speedMarks}
                  step={1}
                  onChange={(e, newValue) => {
                    setReportSpeed(newValue);
                    setUnsavedChanges(true);
                  }}
                  aria-labelledby="report-speed-slider"
                  sx={{ mt: 2 }}
                />
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  Current report speed: {reportSpeed}
                </Typography>
              </Grid>
              {/* Add Divider */}
              <Divider sx={{ my: 2 }} />
              <Grid item xs={12}>
                <Typography variant="body1">Font Size</Typography>
                <Slider
                  value={fontSize}
                  min={12}
                  max={24}
                  marks={fontSizeMarks}
                  step={null} // Only allow selecting predefined values
                  onChange={(e, newValue) => {
                    setFontSize(newValue);
                    setUnsavedChanges(true);
                  }}
                  aria-labelledby="font-size-slider"
                  sx={{ mt: 2 }}
                />
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  Current font size: {fontSize}px
                </Typography>
              </Grid>
              {/* Add Divider */}
              <Divider sx={{ my: 2 }} />

              {/* Add color mode switch */}
              <Grid item xs={12}>
                <Typography variant="body1">Dark Mode</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === "dark"}
                      onChange={handleColorModeChange}
                      color="primary"
                    />
                  }
                  label={mode === "dark" ? "Dark Mode" : "Light Mode"}
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Display unsaved changes message */}
            {unsavedChanges && (
              <Typography
                variant="body2"
                color="error"
                align="center"
                sx={{ mt: 1 }}
              >
                You have unsaved changes!
              </Typography>
            )}

            <CardActions sx={{ justifyContent: "space-between" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!unsavedChanges} // Disable save button if no changes
              >
                Save Settings
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={resetSettings}
              >
                Reset Settings
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
