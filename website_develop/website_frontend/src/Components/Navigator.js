import "@fontsource/quicksand";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import SearchIcon from "@mui/icons-material/Search";
import UploadIcon from "@mui/icons-material/Upload";

import {
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import ChatBot from "./ChatBot";

function Navigator(props) {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [floatingButtonVisible, setFloatingButtonVisible] = useState(false);
  const [selectedDocumentID, setSelectedDocumentID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const handleExit = () => {
    // Clear the token from localStorage or sessionStorage
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    window.postMessage({ type: "USER_LOGOUT" }, "*");

    // Redirect to the login page
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedDocuments = JSON.parse(localStorage.getItem("cachedDocuments"));
    const cacheTimestamp = parseInt(localStorage.getItem("cacheTimestamp"), 10);
    const CACHE_VALIDITY_DURATION = 10 * 60 * 1000; // 10 minutes

    if (
      cachedDocuments &&
      Date.now() - cacheTimestamp < CACHE_VALIDITY_DURATION
    ) {
      console.log("Using cached documents");
      setCategories(transformDocuments(cachedDocuments));
      setIsLoading(false);

      const socket = io.connect("https://wrapcapstone.com", {
        query: { token: token },
      });
      socket.on("reportList", (documents) => {
        // Cache documents and timestamp
        localStorage.setItem("cachedDocuments", JSON.stringify(documents));
        localStorage.setItem("cacheTimestamp", Date.now());

        setCategories(transformDocuments(documents));
        setIsLoading(false);
      });
      socket.on("error", console.error);

      return () => socket.disconnect();
    } else {
      console.log("Fetching fresh documents from the server");
      const socket = io("https://wrapcapstone.com", {
        secure: true,
        query: { token },
      });

      socket.on("reportList", (documents) => {
        // Cache documents and timestamp
        localStorage.setItem("cachedDocuments", JSON.stringify(documents));
        localStorage.setItem("cacheTimestamp", Date.now());

        setCategories(transformDocuments(documents));
        setIsLoading(false);
      });
      socket.on("error", console.error);

      return () => socket.disconnect();
    }
  }, []);

  // const handleDocumentDownload = async (documentID) => {
  //   console.log("Downloading document with ID:", documentID);
  //   try {wrapcapstone.com
  //     const token = localStorage.getItem("token");
  //     const response = await fetch("https://wrapcapstone.com/download-pdf", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ documentID }),
  //     });
  //     if (!response.ok) {
  //       throw new Error(`Failed to download PDF: ${response.statusText}`);
  //     }
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `document-${documentID}.pdf`;
  //     document.body.appendChild(a);
  //     a.click();

  //     a.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error downloading the document:", error);
  //   }
  // };

  const handleDocumentDelete = async (documentID) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://wrapcapstone.com/delete-doc", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentID }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setCategories((prevCategories) =>
          prevCategories.filter(
            (category) => category.documentID !== documentID
          )
        );
      }
    } catch (error) {
      console.error("Error sending document ID:", error);
    }
  };

  const handleDocumentSelect = async (documentID) => {
    try {
      const response = await fetch("https://wrapcapstone.com/response-docID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentID }),
      });
      const data = await response.json();
      setFloatingButtonVisible(true);
      setSelectedDocumentID(documentID);
      //console.log(data);
    } catch (error) {
      console.error("Error sending document ID:", error);
    }
  };
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItwrapcapstone.com;
      try {
        setIsUploading(true); // Start showing the uploading animation
        const response = await fetch("https://wrapcapstone.com/upload-pdf", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false); // Stop the animation after the upload completes
      }
    }
  };

  const triggerFileUpload = () => fileInputRef.current.click();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenChatbot = () => {
    setChatbotVisible(true);
    setFloatingButtonVisible(false);
  };

  const handleCloseChatbot = () => {
    setChatbotVisible(false);
    setFloatingButtonVisible(true);
  };

  const filteredCategories = categories.filter((category) =>
    category.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    drawer: {
      width: "100%",
      height: "100%",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      "& .MuiDrawer-paper": {
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        bgcolor: "#171717",
        color: "#ffffff",
        fontFamily: "Quicksand",
      },
    },
    listContainer: {
      overflowY: "auto",
      flexGrow: 1,
    },
    listItem: {
      py: "12px",
      px: "16px",
      my: "4px",
      bgcolor: "transparent",
      "&:hover, &:focus": {
        bgcolor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
      },
      "& .MuiListItemIcon-root": {
        color: "#ffffff",
      },
      "& .MuiListItemText-primary": {
        color: "#ffffff",
        fontWeight: 500,
      },
      "& .MuiListItemText-secondary": {
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: "0.875rem",
      },
    },
    fixedSection: {
      width: "100%",
    },
    thickDivider: {
      bgcolor: "#E8E8E8",
      my: "4px",
      height: "2px",
      // 75% width centralized
      width: "80%",
      mx: "auto",
    },
    input: {
      display: "none",
    },
    divider: {
      bgcolor: "#E8E8E8",
      my: "4px",
      width: "75%",
      mx: "auto",
    },
    floatingButton: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      backgroundColor: "#000",
      color: "#fff",
      borderRadius: "50%",
      width: "60px",
      height: "60px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      zIndex: 1000,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    },
  };
  return (
    <Drawer variant="permanent" sx={styles.drawer} {...props}>
      <div style={styles.listContainer}>
        <List>
          <ListItem sx={styles.listItem} style={{ justifyContent: "center" }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={styles.searchBar}
              InputProps={{
                startAdornment: <SearchIcon />,
                sx: { color: "#ffffff" },
              }}
            />
          </ListItem>
          <Divider sx={styles.divider} />
          {/* Render documents */}
          {filteredCategories.map((category) => (
            <React.Fragment key={category.id}>
              <ListItem
                sx={styles.listItem}
                secondaryAction={
                  <>
                    {/* <IconButton
                      edge="end"
                      aria-label="download"
                      onClick={() =>
                        handleDocumentDownload(category.documentID)
                      }
                    >
                      <DownloadIcon sx={{ color: "#ffffff" }} />
                    </IconButton> */}
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDocumentDelete(category.documentID)}
                    >
                      <DeleteIcon sx={{ color: "#ffffff" }} />
                    </IconButton>
                  </>
                }
              >
                <ListItemButton
                  onClick={() => handleDocumentSelect(category.documentID)}
                >
                  <ListItemIcon>
                    <InsertDriveFileIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={category.id}
                    secondary={`Date: ${category.date}`}
                  />
                </ListItemButton>
              </ListItem>
              <Divider sx={styles.divider} />
            </React.Fragment>
          ))}
        </List>
      </div>
      <div style={styles.fixedSection}>
        <Divider sx={styles.thickDivider} />
        {/* Fixed section for Upload and Exit */}
        <List>
          <ListItemButton sx={styles.listItem} onClick={triggerFileUpload}>
            {isUploading ? (
              <CircularProgress size={24} /> // A small-sized circular progress indicator
            ) : (
              <UploadIcon />
            )}
            <ListItemText primary="Upload" />
          </ListItemButton>
          <ListItemButton sx={styles.listItem} onClick={handleExit}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Exit" />
          </ListItemButton>
        </List>

        {chatbotVisible && (
          <ChatBot
            onClose={handleCloseChatbot}
            documentID={selectedDocumentID}
          />
        )}
        {floatingButtonVisible && !chatbotVisible && (
          <button style={styles.floatingButton} onClick={handleOpenChatbot}>
            <QuestionAnswerRoundedIcon fontSize="large" />
          </button>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={styles.input}
        onChange={handleFileUpload}
        accept=".pdf"
      />
    </Drawer>
  );
}

function transformDocuments(documents) {
  return documents.map((doc) => ({
    id: `${doc.companyName} - ${doc.documentType}`,
    documentID: doc.DocumentID,
    date: new Date(doc.reportDate).toLocaleDateString(),
  }));
}

export default Navigator;
