// Header.js

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SettingsIcon from "@mui/icons-material/Settings";
import StorageIcon from "@mui/icons-material/Storage";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { ThemeContext } from "../colorTheme/ThemeContext";

function Header({
  onDocumentSettingsClick,
  isDocumentSettingsClicked,
  toggleNavigator,
  isShortNavigator,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const { mode } = useContext(ThemeContext);

  const [documentCompany, setDocumentCompany] = useState("Welcome to Wrap");
  const [documentCategory, setDocumentCategory] = useState(
    "Select a document to open the report"
  );
  const [documentDate, setDocumentDate] = useState();
  const [currentDocumentID, setCurrentDocumentID] = useState(null);
  const currentDocumentIDRef = useRef(currentDocumentID);

  // Font size state
  const [fontSize, setFontSize] = useState(
    JSON.parse(localStorage.getItem("fontSize")) || 16 // Default to 16px
  );
  useEffect(() => {
    console.log(
      "Updating currentDocumentIDRef in header.js .current to:",
      currentDocumentID
    );
    currentDocumentIDRef.current = currentDocumentID;
  }, [currentDocumentID]);

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

    const socket = io.connect("https://wrapcapstone.com", {
      query: { token: token },
    });

    console.log("Attempting to connect to WebSocket server");

    socket.on("reportGenerated", (report) => {
      console.log("Report received:", report);
      setDocumentCompany(report.company);
      setDocumentCategory(report.category);
      setDocumentDate(report.date);

      setCurrentDocumentID(report.documentID);
      console.log(
        "Current document ID has been updated to:",
        report.documentID
      );
    });

    socket.on("selectDocument", (selectInfo) => {
      console.log("Report Selected: ", selectInfo);
      setDocumentCompany(selectInfo.company);
      setDocumentCategory(selectInfo.category);
      setDocumentDate(selectInfo.date);

      setCurrentDocumentID(selectInfo.documentID);
      console.log(
        "Current document ID has been updated to:",
        selectInfo.documentID
      );
    });

    socket.on("documentDeleted", async (data) => {
      console.log("Document deleted received:", data);
      const { documentID: deletedDocumentID } = data;
      console.log("current doc id is " + currentDocumentIDRef.current);
      console.log("deleted doc id is " + deletedDocumentID);
      if (currentDocumentIDRef.current === deletedDocumentID) {
        console.log("Current document was deleted, clearing the header.");

        // Clear the header information
        setDocumentCompany("Welcome to Wrap");
        setDocumentCategory("Select a document to open the report");
        setDocumentDate(null);

        // Clear the current document ID
        setCurrentDocumentID(null);
      }
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

  const headerBackgroundColor =
    mode === "light" ? "rgb(245, 245, 245)" : "rgb(18, 18, 18)";

  const headerStyle = {
    appBar: {
      backgroundColor: headerBackgroundColor,
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
                color: theme.palette.text.primary,
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
              {isDocumentSettingsClicked && (
                <BackupTableIcon sx={headerStyle.icon} />
              )}
              {!isDocumentSettingsClicked && (
                <MenuBookIcon sx={headerStyle.icon} />
              )}
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
                  <StorageIcon sx={headerStyle.icon} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Profile">
                <IconButton
                  color="inherit"
                  onClick={handleProfileClick}
                  sx={headerStyle.iconButton}
                >
                  <AccountCircleIcon sx={headerStyle.icon} />
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
