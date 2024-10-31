import AssignmentIcon from "@mui/icons-material/Assignment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home"; // Import HomeIcon
import { Box, IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ShortNavigator() {
  const navigate = useNavigate(); // Initialize the navigate function from react-router-dom

  // Handle the exit/logout functionality
  const handleExit = () => {
    // Clear the token from localStorage or sessionStorage
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    window.postMessage({ type: "USER_LOGOUT"}, "*");

    // Redirect to the login page
    navigate("/login", { replace: true });
  };

  const handleHome = () => {
    navigate("/mainpage");
  };

  const handleLibrary = () => {
    navigate("/history");
  };

  return (
    <Box
      sx={{
        width: "70px",
        height: "100vh", // Full viewport height
        backgroundColor: "#181B1B",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px 0", // Adjusted padding
        position: "fixed", // Keeps it fixed in place
        overflow: "hidden", // Prevent scrollbars
      }}
    >
      <IconButton
        color="secondary"
        sx={{ marginBottom: "15px" }}
        onClick={handleHome}
      >
        <HomeIcon fontSize="large" sx={{ color: "white" }} />{" "}
        {/* White Icon Color */}
      </IconButton>
      <IconButton
        color="secondary"
        sx={{ marginBottom: "15px" }}
        onClick={handleLibrary}
      >
        <AssignmentIcon fontSize="large" sx={{ color: "white" }} />{" "}
        {/* White Icon Color */}
      </IconButton>
      <Box sx={{ flexGrow: 1 }} />{" "}
      {/* This will push the exit button to the bottom */}
      <IconButton
        color="secondary"
        sx={{ marginBottom: "10px" }}
        onClick={handleExit}
      >
        <ExitToAppIcon fontSize="large" sx={{ color: "white" }} />{" "}
        {/* White Icon Color */}
      </IconButton>
    </Box>
  );
}
