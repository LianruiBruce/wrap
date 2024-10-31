// Paperbase.js

import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Link,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Content from "../Components/Content";
import Header from "../Components/Header";
import Navigator from "../Components/Navigator";
import ShortNavigator from "../Components/ShortNavigator";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Wrap
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function Paperbase() {
  const [fontSize, setFontSize] = useState(
    JSON.parse(localStorage.getItem("fontSize")) || 16
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
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("wrapcapstone.com/user-documents", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

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

  const theme = createTheme({
    palette: {
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
    },
    typography: {
      fontFamily: '"QuickSand", Comforta',
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
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#181B1B",
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
      MuiTab: {
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
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const [isShortNavigator, setIsShortNavigator] = useState(false);
  const [isDocumentSettingsClicked, setIsDocumentSettingsClicked] =
    useState(false);
  const [documents, setDocuments] = useState([]); // Empty array to hold document data
  const [isLoading, setIsLoading] = useState(true);

  const drawerWidth = isShortNavigator ? 100 : 256;

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
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        {/* Navigator */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {!isSmUp && (
            <ShortNavigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              documents={documents}
              isLoading={isLoading}
            />
          )}

          {/* Tablet and Desktop view */}
          {isSmUp ? (
            isShortNavigator ? (
              <ShortNavigator
                PaperProps={{ style: { width: drawerWidth } }}
                documents={documents}
                isLoading={isLoading}
              />
            ) : (
              <Navigator
                PaperProps={{ style: { width: drawerWidth } }}
                documents={documents}
                isLoading={isLoading}
              />
            )
          ) : null}
        </Box>

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          {/* Header */}
          <Header
            onDocumentSettingsClick={handleDocumentSettingsClick}
            isDocumentSettingsClicked={isDocumentSettingsClicked}
            toggleNavigator={toggleNavigator}
            isShortNavigator={isShortNavigator}
          />

          {/* Content */}
          <Box
            component="main"
            sx={{
              flex: 1,
              position: "relative",
              overflow: "auto",
            }}
          >
            {/* Scrollable Content */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                p: 2,
              }}
            >
              <Content isDocumentSettingsClicked={isDocumentSettingsClicked} />
            </Box>
          </Box>

          {/* Footer */}
          <Box component="footer" sx={{ p: 2, bgcolor: "white" }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
