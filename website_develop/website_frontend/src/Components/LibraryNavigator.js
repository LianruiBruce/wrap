import AssignmentIcon from "@mui/icons-material/Assignment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import { Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LibraryNavigator({ collapsed }) {
  const navigate = useNavigate();
  const [numOfDocs, setNumOfDocs] = useState(0);
  const token = localStorage.getItem("token");

  const handleExit = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    window.postMessage({ type: "USER_LOGOUT" }, "*");

    navigate("/login", { replace: true });
  };

  const handleHome = () => {
    navigate("/mainpage");
  };

  //console.log("Number of Documents:", numOfDocs);

  return (
    <Box
      sx={{
        width: collapsed ? "70px" : "200px",
        height: "100vh",
        backgroundColor: "#181B1B",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px 0",
        position: "fixed",
        left: 0,
        top: 0,
        transition: "width 0.3s ease",
      }}
    >
      <IconButton
        color="secondary"
        sx={{ marginBottom: "15px" }}
        onClick={handleHome}
      >
        <HomeIcon fontSize="large" sx={{ color: "white" }} />
      </IconButton>
      {Array.from({ length: numOfDocs }).map((_, index) => (
        <IconButton key={index} color="secondary" sx={{ marginBottom: "15px" }}>
          <AssignmentIcon fontSize="large" sx={{ color: "white" }} />
        </IconButton>
      ))}
      <Box sx={{ flexGrow: 1 }} />
      <IconButton
        color="secondary"
        sx={{ marginBottom: "10px" }}
        onClick={handleExit}
      >
        <ExitToAppIcon fontSize="large" sx={{ color: "white" }} />
      </IconButton>
    </Box>
  );
}
