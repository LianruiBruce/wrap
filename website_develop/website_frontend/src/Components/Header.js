// Header.js

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

function Header({
  onDocumentSettingsClick,
  isDocumentSettingsClicked,
  toggleNavigator,
  isShortNavigator,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [documentCompany, setDocumentCompany] = useState("Welcome to Wrap");
  const [documentCategory, setDocumentCategory] = useState(
    "Select a document to open the report"
  );
  const [documentDate, setDocumentDate] = useState();

  // Font size state
  const [fontSize, setFontSize] = useState(
    JSON.parse(localStorage.getItem("fontSize")) || 16 // Default to 16px
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const newFontSize = JSON.parse(localStorage.getItem("fontSize")) || 16;
      setFontSize(newFontSize);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const socket = io.connect("wrapcapstone.com", {
      query: { token: token },
    });

    console.log("Attempting to connect to WebSocket server");

    socket.on("reportGenerated", (report) => {
      console.log("Report received:", report);
      setDocumentCompany(report.company);
      setDocumentCategory(report.category);
      setDocumentDate(report.date);
    });

    socket.on("selectDocument", (selectInfo) => {
      console.log("Report Selected: ", selectInfo);
      setDocumentCompany(selectInfo.company);
      setDocumentCategory(selectInfo.category);
      setDocumentDate(selectInfo.date);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleGlobalSettingClick = () => {
    navigate("/settings");
  };

  const handleHistoryClick = () => {
    navigate("/history");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleDocumentSettingsClick = () => {
    onDocumentSettingsClick();
  };

  const documentSettingsButtonLabel = isDocumentSettingsClicked
    ? "View Summary"
    : "View Original Document";

  const headerStyle = {
    appBar: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      boxShadow: "none",
    },
    toolbar: {
      minHeight: 64,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    documentTitle: {
      fontWeight: 600,
      flexGrow: 1,
      textAlign: "center",
      fontSize: `${fontSize * 1.75}px`, // Adjusted font size for title
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    iconButton: {
      color: theme.palette.text.primary,
    },
    leftSection: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      flexBasis: "20%", // Adjusted width
    },
    centerSection: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexBasis: "60%", // Adjusted width
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      flexBasis: "20%", // Adjusted width
    },
    icon: {
      fontSize: "1.8rem",
    },
    avatar: {
      width: 36,
      height: 36,
    },
  };

  return (
    <AppBar position="sticky" sx={headerStyle.appBar}>
      <Toolbar sx={headerStyle.toolbar}>
        {/* Left Section */}
        <Box sx={headerStyle.leftSection}>
          {/* Expand/Collapse Sidebar Button */}
          <Tooltip
            title={isShortNavigator ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="toggle navigator"
              onClick={toggleNavigator}
              sx={{
                ...headerStyle.iconButton,
                marginLeft: isShortNavigator ? "5px" : "12px",
                transition: "margin 0.8s ease",
              }}
            >
              {isShortNavigator ? (
                <ChevronRightIcon sx={headerStyle.icon} />
              ) : (
                <ChevronLeftIcon sx={headerStyle.icon} />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Center Section */}
        <Box sx={headerStyle.centerSection}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: theme.spacing(2),
            }}
          >
            {/* Company Name */}
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontWeight: 700,
                marginBottom: 0.5,
                fontSize: `${fontSize * 1.75}px`,
              }}
            >
              {documentCompany}
            </Typography>

            {/* Category and Date */}
            <Typography
              variant="subtitle1"
              noWrap
              sx={{
                fontSize: `${fontSize}px`,
                color: theme.palette.text.secondary,
              }}
            >
              {documentCategory}
              {documentDate && (
                <>
                  {" "}
                  <span style={{ margin: "0 8px" }}>|</span> {documentDate}
                </>
              )}
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={headerStyle.rightSection}>
          {/* Original File Button */}
          <Tooltip title={documentSettingsButtonLabel}>
            <IconButton
              color="inherit"
              onClick={handleDocumentSettingsClick}
              sx={headerStyle.iconButton}
            >
              <VisibilityIcon sx={headerStyle.icon} />
            </IconButton>
          </Tooltip>

          {/* Action Icons */}
          {isSmUp && (
            <>
              <Tooltip title="Global Settings">
                <IconButton
                  color="inherit"
                  onClick={handleGlobalSettingClick}
                  sx={headerStyle.iconButton}
                >
                  <SettingsIcon sx={headerStyle.icon} />
                </IconButton>
              </Tooltip>
              <Tooltip title="History">
                <IconButton
                  color="inherit"
                  onClick={handleHistoryClick}
                  sx={headerStyle.iconButton}
                >
                  <HistoryIcon sx={headerStyle.icon} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Profile">
                <IconButton
                  color="inherit"
                  onClick={handleProfileClick}
                  sx={headerStyle.iconButton}
                >
                  <Avatar sx={headerStyle.avatar}>M</Avatar>
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
