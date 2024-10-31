import React, { useEffect, useState } from "react";
import ShortNavigator from "../Components/ShortNavigator"; // import the ShortNavigator component
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
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom theme to match your design
const theme = createTheme({
  palette: {
    primary: {
      main: "#181B1B", // dark mode color
    },
    secondary: {
      main: "#FFC773", // highlight color
    },
    background: {
      default: "#F5F5F5", // Light background for the settings
    },
  },
  typography: {
    fontFamily: '"Quicksand", sans-serif',
    h6: {
      fontWeight: 500,
      fontSize: "1.25rem",
      letterSpacing: "0.0075em",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      color: "#333",
    },
  },
});

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
    JSON.parse(localStorage.getItem("fontSize")) || 16 // Default to 16px
  ); // New state for font size

  // Save updated values to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("numberOfSections", JSON.stringify(numberOfSections));
    localStorage.setItem("summaryLength", JSON.stringify(summaryLength));
    localStorage.setItem("reportSpeed", JSON.stringify(reportSpeed));
    localStorage.setItem("fontSize", JSON.stringify(fontSize)); // Save font size
  }, [numberOfSections, summaryLength, reportSpeed, fontSize]);

  // Function to save settings to the backend
  const handleSave = () => {
    const settings = {
      numberOfSections,
      summaryLength,
      reportSpeed,
      fontSize, // Include font size
    };
    console.log("Settings saved:", settings);

    // Send the settings to the backend
    fetch("http://localhost:3000/api/settings", {
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
        } else {
          console.error("Failed to save settings to the server");
        }
      })
      .catch((error) => {
        console.error("Error sending settings to the server:", error);
      });
  };

  // Function to reset settings
  const resetSettings = () => {
    const userToken = localStorage.getItem("userToken");

    setNumberOfSections(3);
    setSummaryLength(100);
    setReportSpeed(4);
    setFontSize(16); // Reset font size to default
    if (userToken) {
      localStorage.setItem("userToken", userToken);
    }
    console.log("Settings reset, token preserved.");
  };

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

  return (
    <ThemeProvider theme={theme}>
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
            backgroundColor: "#f7f8fc",
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
                    onChange={(e, newValue) => setNumberOfSections(newValue)}
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
                    onChange={(e, newValue) => setSummaryLength(newValue)}
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
                    onChange={(e, newValue) => setReportSpeed(newValue)}
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
                    onChange={(e, newValue) => setFontSize(newValue)}
                    aria-labelledby="font-size-slider"
                    sx={{ mt: 2 }}
                  />
                  <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    Current font size: {fontSize}px
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
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
    </ThemeProvider>
  );
}
