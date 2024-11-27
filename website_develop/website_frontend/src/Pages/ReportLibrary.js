import React, { useEffect, useRef,useState, useMemo ,useContext } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import FlagIcon from "@mui/icons-material/Flag";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import AddIcon from "@mui/icons-material/Add";
import Header from "../Components/LibraryHeader";
import LibraryNavigator from "../Components/LibraryNavigator";
import { ThemeContext } from "../colorTheme/ThemeContext";
import pdfIcon from '../Images/PDF.png';
import emailIcon from '../Images/Email.png'; 
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; 
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";

function ReportLibrary() {
  const { mode } = useContext(ThemeContext);
  const theme = useTheme();

  const [documents, setDocuments] = useState([]);
  //const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [riskScoreData, setRiskScoreData] = useState([]);
  const [riskLevelData, setRiskLevelData] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(4);
  const navigate = useNavigate();
  const [documentTypeData, setDocumentTypeData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [sortBy, setSortBy] = useState("date"); // Default is "date"
  const [sortOrder, setSortOrder] = useState("newest to oldest"); 
  const [readabilityData, setReadabilityData] = useState([]);
  const [riskTrends, setRiskTrends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  const chartThemeColors = {
    textColor: mode === "dark" ? "#E0E0E0" : theme.palette.text.primary,
    gridColor:
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : theme.palette.divider,
    backgroundColor:
      mode === "dark" ? "#2D2D2D" : theme.palette.background.paper,
    tooltipBackgroundColor:
      mode === "dark" ? "#424242" : theme.palette.background.paper,
    tooltipTextColor: mode === "dark" ? "#E0E0E0" : theme.palette.text.primary,
  };

  const [displayedDocuments, setDisplayedDocuments] = useState([]);

  const chartRefs = {
    reportsPerMonth: useRef(),
    riskScores: useRef(),
    riskLevelDistribution: useRef(),
    documentTypes: useRef(),
    readabilityScore: useRef(),
    documentRiskTrends: useRef(),
  };


  const exportChartsToPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const chartKeys = Object.keys(chartRefs);
    
    for (let i = 0; i < chartKeys.length; i++) {
      const key = chartKeys[i];
      const ref = chartRefs[key];
      const chartElement = ref.current;
  
      if (chartElement) {
        const canvas = await html2canvas(chartElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
  
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
        if (i > 0) {
          pdf.addPage();
        }
  
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
    }
  
    pdf.save('charts.pdf');
  };


const filteredDocuments = useMemo(() => {
  let docs = [...documents];

  // Apply flag filter
  if (showFlaggedOnly) {
    docs = docs.filter((doc) => doc.flagStatus);
  }

  // Apply search query filter
  if (searchQuery) {
    docs = docs.filter(
      (doc) =>
        doc.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply sorting
  if (sortBy === "risk score") {
    docs.sort((a, b) => {
      if (sortOrder === "high to low") {
        return b.overallScore - a.overallScore;
      } else {
        return a.overallScore - b.overallScore;
      }
    });
  } else if (sortBy === "date") {
    docs.sort((a, b) => {
      const dateA = new Date(a.reportDate || 0);
      const dateB = new Date(b.reportDate || 0);

      if (sortOrder === "newest to oldest") {
        return dateB - dateA; // Descending order
      } else {
        return dateA - dateB; // Ascending order
      }
    });
  }

  return docs;
}, [documents, showFlaggedOnly, searchQuery, sortBy, sortOrder]);

useEffect(() => {
  setDisplayedDocuments(filteredDocuments);
}, [filteredDocuments]);

  

  useEffect(() => {
    let docs = [...filteredDocuments];
  
    if (sortBy === "risk score") {
      docs.sort((a, b) => {
        if (sortOrder === "high to low") {
          return b.overallScore - a.overallScore;
        } else {
          return a.overallScore - b.overallScore;
        }
      });
    } else if (sortBy === "date") {
      docs.sort((a, b) => {
        const dateA = new Date(a.reportDate || 0); // Use reportDate and handle missing dates
        const dateB = new Date(b.reportDate || 0);
  
        if (sortOrder === "newest to oldest") {
          return dateB - dateA; // Descending order
        } else {
          return dateA - dateB; // Ascending order
        }
      });
    }
  
    setDisplayedDocuments(docs); // Update the displayed documents
  }, [filteredDocuments, sortBy, sortOrder]);
  

  const computeRiskTrends = (documents) => {
    const monthlyRiskScores = {};

    documents.forEach((doc) => {
      const reportDate = new Date(doc.reportDate);
      const month = reportDate.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const overallRiskScore = parseFloat(doc.overallScore) || 0;

      if (!monthlyRiskScores[month]) {
        monthlyRiskScores[month] = { totalRisk: 0, count: 0 };
      }

      monthlyRiskScores[month].totalRisk += overallRiskScore;
      monthlyRiskScores[month].count += 1;
    });

    // Generate the final trend data
    return Object.keys(monthlyRiskScores)
      .map((month) => ({
        month,
        averageRisk:
          monthlyRiskScores[month].totalRisk / monthlyRiskScores[month].count,
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const handleDocumentClick = async (documentID) => {
    try {
      const token = localStorage.getItem("token");
      navigate("/mainpage");
      const response = await fetch("https://wrapcapstone.com/response-docID", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentID }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Document information:", data.information);
        navigate("/mainpage");
      } else {
        console.error("Failed to select document:", data.message);
      }
    } catch (error) {
      console.error("Error selecting document:", error);
    }
  };

  const handleShowMore = () => {
    setDisplayLimit((prevLimit) => prevLimit + 4);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);
  
  async function fetchUserInfo() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://wrapcapstone.com/getUserInfo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user information');
      }
  
      const { userInfo } = await response.json();
      setUserInfo(userInfo);
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  }

async function emailChartsToUser() {
  if (!userInfo) {
    console.error('User info not available');
    return;
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const chartKeys = Object.keys(chartRefs);

  for (let i = 0; i < chartKeys.length; i++) {
    const key = chartKeys[i];
    const ref = chartRefs[key];
    const chartElement = ref.current;

    if (chartElement) {
      // Wait a moment to ensure rendering is complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(chartElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    } else {
      console.warn(`Chart element for ${key} is not available.`);
    }
  }

  // Get the PDF as a data URI and extract the base64 string
  const pdfDataUri = pdf.output('datauristring');
  const base64Pdf = pdfDataUri.split(',')[1];

  // Send the PDF to the server
  try {
    const response = await fetch('/api/send-graphs-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userInfo.email,
        name: userInfo.firstName + " " + userInfo.lastName,
        pdfData: base64Pdf,
      }),
    });

    if (response.ok) {
      console.log('Email sent successfully');
      alert('Email sent successfully');
    } else {
      const errorData = await response.json();
      console.error('Error sending email:', errorData.message);
      alert('Error sending email: ' + errorData.message);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Error sending email: ' + error.message);
  }
}

  const getColor = (score) => {
    if (mode === "dark") {
      if (score <= 2) return "#4CAF50"; // Brighter green for dark mode
      if (score <= 3.5) return "#FFA726"; // Brighter orange for dark mode
      return "#EF5350"; // Brighter red for dark mode
    } else {
      if (score <= 2) return theme.palette.success.main;
      if (score <= 3.5) return theme.palette.warning.main;
      return theme.palette.error.main;
    }
  };

  const getColorForDocumentType = (documentType) => {
    // Define a color palette
    const colors = {
      Contract: "#4CAF50",
      Agreement: "#2196F3",
      Invoice: "#FFC107",
      Proposal: "#9C27B0",
      Report: "#FF5722",
      // Add other document types as needed
    };

    // Return the color for the document type, or a default color
    return colors[documentType] || theme.palette.primary.light;
  };
  const getColorForRiskLevel = (riskLevel) => {
    if (mode === "dark") {
      switch (riskLevel) {
        case "Low":
          return "#4CAF50"; // Brighter green
        case "Moderate":
          return "#FFA726"; // Brighter orange
        case "High":
          return "#FF7043"; // Brighter deep orange
        default:
          return "#90CAF9"; // Brighter blue
      }
    } else {
      switch (riskLevel) {
        case "Low":
          return theme.palette.success.main;
        case "Moderate":
          return theme.palette.warning.light;
        case "High":
          return theme.palette.warning.main;
        default:
          return theme.palette.primary.main;
      }
    }
  };

  const toggleFlag = async (documentID) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://wrapcapstone.com/toggleFlagOfDoc", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docID: documentID }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.success) {
        setDocuments((prevDocuments) =>
          prevDocuments.map((doc) =>
            doc.DocumentID === documentID
              ? { ...doc, flagStatus: !doc.flagStatus }
              : doc
          )
        );
      } else {
        console.error("Failed to toggle flag:", data.message);
      }
    } catch (error) {
      console.error("Error toggling flag:", error);
    }
  };
  
  

  const handleDocumentDownload = async (documentID) => {
    console.log("Downloading document with ID:", documentID);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://wrapcapstone.com/download-pdf", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentID }),
      });
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `document-${documentID}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the document:", error);
    }
  };

  const toggleFlaggedFilter = () => {
    setShowFlaggedOnly((prev) => !prev);
  };
  

  const handleFilterChange = (query) => {
    setSearchQuery(query);
  };
  
  const handleDeleteDocument = async (documentID, flagStatus) => {
    try {
      if (flagStatus) {
        const confirmed = window.confirm(
          "This document is flagged. Are you sure you want to delete it?"
        );
        if (!confirmed) {
          return;
        }
      }

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
      if (data.success) {
        const updatedDocuments = documents.filter(
          (doc) => doc.DocumentID !== documentID
        );
        setDocuments(updatedDocuments);
        //setFilteredDocuments(updatedDocuments);
      } else {
        console.error("Failed to delete document:", data.message);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://wrapcapstone.com/user-documents", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
  
        const riskCategories = ["Legal", "Financial", "Data"];
        const totalRiskScores = { Legal: 0, Financial: 0, Data: 0 };
        let documentCount = 0;
        const riskLevelCounts = {
          Low: 0,
          Moderate: 0,
          High: 0,
          Critical: 0, // Include 'Critical' if needed
        };
  
        const documentsWithRisk = await Promise.all(
          data.map(async (doc) => {
            let overallRiskLevel = "Low";
            let overallScore = 0;
  
            if (typeof doc.risky === "string") {
              try {
                doc.risky = JSON.parse(doc.risky);
              } catch (e) {
                console.error("Error parsing risky field:", e);
              }
            }
  
            if (doc.risky && Array.isArray(doc.risky)) {
              doc.risky.forEach((risk) => {
                const category = Object.keys(risk)[0];
                const score = parseFloat(risk[category].Score);
                if (category !== "Overall") {
                  totalRiskScores[category] += score;
                } else {
                  overallScore = score;
                }
              });
              if (overallScore > 4) overallRiskLevel = "Critical";
              else if (overallScore > 3) overallRiskLevel = "High";
              else if (overallScore > 2) overallRiskLevel = "Moderate";
              else overallRiskLevel = "Low";
            }
  
            riskLevelCounts[overallRiskLevel] += 1;
  
            const flagResponse = await fetch(
              "https://wrapcapstone.com/getFlagOfDoc",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ documentID: doc.DocumentID }), // Use documentID
              }
            );
  
            const flagData = await flagResponse.json();
            console.log("docID is " + doc.DocumentID + "Flag data:" + flagData.flag);
            const flagStatus = flagData.success ? flagData.flag : false;
  
            documentCount += 1;
  
            return { ...doc, overallRiskLevel, overallScore, flagStatus };
          })
        );
  
        setDocuments(documentsWithRisk);
        
        // Proceed with other computations using documentsWithRisk
        const documentTypeCounts = {};

documentsWithRisk.forEach((doc) => {
  const docType = doc.documentType || 'Unknown';
  if (documentTypeCounts[docType]) {
    documentTypeCounts[docType] += 1;
  } else {
    documentTypeCounts[docType] = 1;
  }
});

const documentTypeDataArray = Object.keys(documentTypeCounts).map((type) => ({
  documentType: type,
  count: documentTypeCounts[type],
}));

setDocumentTypeData(documentTypeDataArray);
console.log('Document Type Data:', documentTypeDataArray);
// Compute readability data
const sortedDocuments = [...documentsWithRisk].sort((a, b) => {
  const readabilityA = parseFloat(a.readability) || 0;
  const readabilityB = parseFloat(b.readability) || 0;
  return readabilityB - readabilityA;
});

// Take the first 6 documents after sorting
const documentsToProcess = sortedDocuments.slice(0, 6);

// Convert counts to an array suitable for the chart
const readabilityDataArray = documentsToProcess.map((doc) => ({
  companyName: doc.companyName || "Unnamed Report",
  readability: parseFloat(doc.readability) || 0,
}));

setReadabilityData(readabilityDataArray);

setReadabilityData(readabilityDataArray);
console.log('Readability Data:', readabilityDataArray);
        // Compute risk trends directly
        const trends = computeRiskTrends(documentsWithRisk);
        setRiskTrends(trends);
        console.log('Risk Trends Data:', trends);
        // Compute reports per month
        const reportsPerMonth = {};
  
        documentsWithRisk.forEach((doc) => {
          const date = new Date(doc.reportDate);
          const month = date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
  
          if (reportsPerMonth[month]) {
            reportsPerMonth[month] += 1;
          } else {
            reportsPerMonth[month] = 1;
          }
        });
  
        const chartDataArray = Object.keys(reportsPerMonth)
          .map((month) => ({
            month,
            reports: reportsPerMonth[month],
          }))
          .sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA - dateB;
          });
  
        setChartData(chartDataArray);
  
        const averageRiskScores = riskCategories.map((category) => ({
          category,
          averageScore:
            documentCount > 0 ? totalRiskScores[category] / documentCount : 0,
        }));
  
        setRiskScoreData(averageRiskScores);
  
        const riskLevelDataArray = Object.keys(riskLevelCounts).map((level) => ({
          name: level,
          value: riskLevelCounts[level],
        }));
  
        setRiskLevelData(riskLevelDataArray);
  
        // Proceed with other state updates like documentTypeData, readabilityData, etc.
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    }
  
    fetchDocuments();
  }, []);
  
  return (
    <Box
      sx={{
        backgroundColor:
          mode === "dark" ? "#1A1A1A" : theme.palette.background.default,
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: theme.palette.text.primary,
      }}
    >
      <Header
        documents={documents}
        onFilterChange={handleFilterChange}
        onToggleFlaggedFilter={toggleFlaggedFilter}
        showFlaggedOnly={showFlaggedOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      

      <Grid container spacing={3} sx={{ maxWidth: "1200px", width: "100%" }}>
        <Grid item xs={collapsed ? 1 : 2}>
          <LibraryNavigator collapsed={collapsed} />
        </Grid>

        <Grid item xs={collapsed ? 11 : 10}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {displayedDocuments.slice(0, displayLimit).length === 0 ? (
                <Typography>No documents found.</Typography>
              ) : (
                displayedDocuments.slice(0, displayLimit).map((doc) => (
                  <Box
                    key={doc.DocumentID}
                    onClick={() => handleDocumentClick(doc.DocumentID)}
                    sx={{
                      marginBottom: "15px",
                      padding: "19px",
                      borderRadius: "10px",
                      backgroundColor:
                        mode === "dark"
                          ? "#2D2D2D"
                          : theme.palette.background.paper,
                      boxShadow:
                        mode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.5)" : 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minHeight: "120px",
                      margin: "15px auto",
                      cursor: "pointer",
                      color:
                        mode === "dark"
                          ? "#E0E0E0"
                          : theme.palette.text.primary,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow:
                          mode === "dark" ? "0 6px 16px rgba(0, 0, 0, 0.7)" : 4,
                      },
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <DescriptionIcon
                        sx={{
                          fontSize: "4rem",
                          marginRight: "20px",
                          color:
                            mode === "dark"
                              ? "#90CAF9"
                              : theme.palette.primary.main,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            color: mode === "dark" ? "#FFFFFF" : "inherit",
                          }}
                        >
                          {doc.companyName}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color:
                              mode === "dark"
                                ? "#B0B0B0"
                                : theme.palette.text.secondary,
                          }}
                        >
                          {`${doc.documentType}; ${new Date(
                            doc.reportDate
                          ).toLocaleDateString()}`}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <CircularProgress
                            variant="determinate"
                            value={(doc.overallScore / 5) * 100}
                            size={50}
                            thickness={5}
                            sx={{
                              color: getColor(doc.overallScore),
                              marginRight: "10px",
                              "& .MuiCircularProgress-circle": {
                                strokeLinecap: "round",
                              },
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "1rem",
                              color: mode === "dark" ? "#E0E0E0" : "inherit",
                            }}
                          >
                            {doc.overallRiskLevel}
                          </Typography>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFlag(doc.DocumentID);
                            }}
                            sx={{
                              marginLeft: "20px",
                              "&:hover": {
                                backgroundColor:
                                  mode === "dark"
                                    ? "rgba(255, 255, 255, 0.1)"
                                    : "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                          >
                            {doc.flagStatus ? (
                              <FlagIcon
                                sx={{
                                  color:
                                    mode === "dark"
                                      ? "#FF5252"
                                      : theme.palette.error.main,
                                  fontSize: "2rem",
                                }}
                              />
                            ) : (
                              <FlagOutlinedIcon
                                sx={{
                                  color:
                                    mode === "dark"
                                      ? "#B0B0B0"
                                      : theme.palette.text.secondary,
                                  fontSize: "2rem",
                                }}
                              />
                            )}
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDocumentDownload(doc.DocumentID);
                        }}
                        sx={{
                          color:
                            mode === "dark"
                              ? "#B0B0B0"
                              : theme.palette.text.secondary,
                          "&:hover": {
                            color:
                              mode === "dark"
                                ? "#FFFFFF"
                                : theme.palette.text.primary,
                            backgroundColor:
                              mode === "dark"
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        <DownloadIcon sx={{ fontSize: "2rem" }} />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDocument(doc.DocumentID, doc.flagStatus);
                        }}
                        sx={{
                          color:
                            mode === "dark"
                              ? "#FF5252"
                              : theme.palette.error.light,
                          "&:hover": {
                            color:
                              mode === "dark"
                                ? "#FF8A80"
                                : theme.palette.error.dark,
                            backgroundColor:
                              mode === "dark"
                                ? "rgba(255, 82, 82, 0.1)"
                                : "rgba(244, 67, 54, 0.04)",
                          },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: "2rem" }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              )}
              {displayLimit < filteredDocuments.length && (
                <Box display="flex" justifyContent="center" marginTop="20px">
                  <IconButton
                    onClick={handleShowMore}
                    sx={{
                      color:
                        mode === "dark"
                          ? "#90CAF9"
                          : theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor:
                          mode === "dark"
                            ? "rgba(144, 202, 249, 0.1)"
                            : "rgba(33, 150, 243, 0.04)",
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              )}
            </Grid>


              {/* Reports Generated Per Month */}
            <Grid item xs={12} md={4}>
           {/* Export to PDF Button */}
           <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end", 
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px", 
        }}
      >
        {/* PDF Download Button */}
        <IconButton
          onClick={exportChartsToPDF}
          aria-label="Export Charts to PDF"
          sx={{
            color: "primary.main",
            "&:hover": {
              color: "primary.dark", 
            },
          }}
        >
          <PictureAsPdfIcon  fontSize="large" />
        </IconButton>

        {/* Email Forward Button */}
        <IconButton
          onClick={emailChartsToUser}
          aria-label="Email Charts"
          sx={{
            color: "primary.main", 
            "&:hover": {
              color: "primary.dark", 
            },
          }}
        >
          <ForwardToInboxIcon fontSize="large" />
        </IconButton>
      </Box>
                <Box
                  ref={chartRefs.reportsPerMonth}
                  sx={{
                    backgroundColor:
                      mode === "dark"
                        ? "#2D2D2D"
                        : theme.palette.background.paper,
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow:
                      mode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.5)" : 3,
                    marginBottom: "20px",
                    color:
                      mode === "dark" ? "#E0E0E0" : theme.palette.text.primary,
                  }}
                 >
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: "20px",
                      color: mode === "dark" ? "#FFFFFF" : "inherit",
                      fontWeight: 600,
                    }}
                  >
                    Reports Generated Per Month
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={chartData}
                      style={{
                        backgroundColor: chartThemeColors.backgroundColor,
                      }}
                    >
                      <CartesianGrid stroke={chartThemeColors.gridColor} />
                      <XAxis
                        dataKey="month"
                        stroke={chartThemeColors.textColor}
                      />
                      <YAxis
                        allowDecimals={false}
                        stroke={chartThemeColors.textColor}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor:
                            chartThemeColors.tooltipBackgroundColor,
                          color: chartThemeColors.tooltipTextColor,
                          border: "none",
                          borderRadius: "4px",
                          boxShadow:
                            mode === "dark"
                              ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                              : "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="reports"
                        stroke={
                          mode === "dark"
                            ? "#90CAF9"
                            : theme.palette.primary.main
                        }
                        strokeWidth={2}
                        dot={{
                          r: 3,
                          fill:
                            mode === "dark"
                              ? "#90CAF9"
                              : theme.palette.primary.main,
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              {/* Average Risk Scores by Category */}
              <Box
               ref={chartRefs.riskScores}
                sx={{
                  backgroundColor:
                    mode === "dark"
                      ? "#2D2D2D"
                      : theme.palette.background.paper,
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow:
                    mode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.5)" : 3,
                  marginBottom: "20px",
                  color:
                    mode === "dark" ? "#E0E0E0" : theme.palette.text.primary,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: "20px",
                    color: mode === "dark" ? "#FFFFFF" : "inherit",
                    fontWeight: 600,
                  }}
                >
                  Average Risk Scores by Category
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={riskScoreData}
                    style={{
                      backgroundColor: chartThemeColors.backgroundColor,
                    }}
                  >
                    <CartesianGrid stroke={chartThemeColors.gridColor} />
                    <XAxis
                      dataKey="category"
                      stroke={chartThemeColors.textColor}
                    />
                    <YAxis
                      domain={[0, 5]}
                      stroke={chartThemeColors.textColor}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          chartThemeColors.tooltipBackgroundColor,
                        color: chartThemeColors.tooltipTextColor,
                        border: "none",
                        borderRadius: "4px",
                        boxShadow:
                          mode === "dark"
                            ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                            : "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="averageScore">
                      {riskScoreData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getColor(entry.averageScore)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              {/* Risk Level Distribution */}
              <Box
               ref={chartRefs.riskLevelDistribution}
                sx={{
                  backgroundColor:
                    mode === "dark"
                      ? "#2D2D2D"
                      : theme.palette.background.paper,
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow:
                    mode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.5)" : 3,
                  color:
                    mode === "dark" ? "#E0E0E0" : theme.palette.text.primary,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: "20px",
                    color: mode === "dark" ? "#FFFFFF" : "inherit",
                    fontWeight: 600,
                  }}
                >
                  Risk Level Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart style={{ backgroundColor: "transparent" }}>
                    <Pie
                      data={riskLevelData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={({ name, percent }) => (percent > 0 ? `${name}` : '')}
                      labelLine={false}
                      stroke={mode === "dark" ? "#2D2D2D" : "#ffffff"}
                      strokeWidth={2}
                    >
                      {riskLevelData.map((entry, index) => {
                        // Enhanced color palette for better visibility
                        const colors = {
                          Low: "#81C784", // Light green
                          Moderate: "#FFA726", // Orange
                          High: "#FF7043", // Deep orange
                        };
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[entry.name]}
                            style={{
                              filter:
                                mode === "dark" ? "brightness(1.2)" : "none",
                              opacity: 0.9,
                            }}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          mode === "dark" ? "#424242" : "#ffffff",
                        color: mode === "dark" ? "#E0E0E0" : "#000000",
                        border: "none",
                        borderRadius: "4px",
                        boxShadow:
                          mode === "dark"
                            ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                            : "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value, name) => {
                        const documentText =
                          value === 1 ? "document" : "documents";
                        return [`${value} ${documentText}`, name];
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      layout="horizontal"
                      wrapperStyle={{
                        color: mode === "dark" ? "#E0E0E0" : "inherit",
                        padding: "10px 0",
                      }}
                      iconType="circle"
                      iconSize={10}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              {/*  Document Types Distribution */}
              <Box
                ref={chartRefs.documentTypes}
                sx={{
                  backgroundColor:
                    mode === "dark"
                      ? "#2D2D2D"
                      : theme.palette.background.paper,
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow:
                    mode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.5)" : 3,
                  marginBottom: "20px",
                  marginTop: "20px",
                  color:
                    mode === "dark" ? "#E0E0E0" : theme.palette.text.primary,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: "20px",
                    color: mode === "dark" ? "#FFFFFF" : "inherit",
                    fontWeight: 600,
                  }}
                >
                  Document Types
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={documentTypeData}
                    style={{
                      backgroundColor: chartThemeColors.backgroundColor,
                    }}
                  >
                    <CartesianGrid stroke={chartThemeColors.gridColor} />
                    <XAxis
                      dataKey="documentType"
                      stroke={chartThemeColors.textColor}
                      interval={0}
                      tick={{
                        fontSize: 10,
                        angle: 45, 
                        textAnchor: "start",
                      }}
                      height={70}
                    />
                    <YAxis
                      allowDecimals={false}
                      stroke={chartThemeColors.textColor}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          chartThemeColors.tooltipBackgroundColor,
                        color: chartThemeColors.tooltipTextColor,
                        border: "none",
                        borderRadius: "4px",
                        boxShadow:
                          mode === "dark"
                            ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                            : "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value, name) => {
                        const documentText =
                          value === 1 ? "document" : "documents";
                        return [`${value} ${documentText}`, "Count"];
                      }}
                    />
                    <Bar dataKey="count">
                      {documentTypeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getColorForDocumentType(entry.documentType)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              {/* readability */}
              <Box
               ref={chartRefs.readabilityScore}
                sx={{
                  backgroundColor:
                    mode === "dark"
                      ? "#2D2D2D"
                      : theme.palette.background.paper,
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow:
                    mode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.5)" : 3,
                  marginBottom: "20px",
                  color:
                    mode === "dark" ? "#E0E0E0" : theme.palette.text.primary,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: "20px",
                    color: mode === "dark" ? "#FFFFFF" : "inherit",
                    fontWeight: 600,
                  }}
                >
                  Readability Score
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={readabilityData}
                    style={{
                      backgroundColor: chartThemeColors.backgroundColor,
                    }}
                    margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                  >
                    <CartesianGrid stroke={chartThemeColors.gridColor} />
                    <XAxis
                      dataKey="companyName" // X-axis will now display report names
                      stroke={chartThemeColors.textColor}
                      interval={0}
                      tick={{ fontSize: 12, angle: 45, textAnchor: "start" }}
                      tickFormatter={(name) =>
                        name.length > 30 ? `${name.slice(0, 30)}...` : name
                      }
                    />
                    <YAxis
                      domain={[0, 20]} // Y-axis adjusts to the max readability score
                      //stroke={chartThemeColors.textColor}
                      // label={{
                      //   value: "Readability Score",
                      //   angle: -90,
                      //   position: "insideLeft",
                      //   fill: chartThemeColors.textColor,
                      // }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          chartThemeColors.tooltipBackgroundColor,
                        color: chartThemeColors.tooltipTextColor,
                        border: "none",
                        borderRadius: "4px",
                        boxShadow:
                          mode === "dark"
                            ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                            : "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value, name) => [`${value}`, "Readability"]}
                    />
                    <Bar dataKey="readability">
                      {readabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#4CAF50" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              {/* Risk Trends */}
              <Box
              ref={chartRefs.documentRiskTrends}
                sx={{
                  backgroundColor:
                    mode === "dark"
                      ? "#2D2D2D"
                      : theme.palette.background.paper,
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow:
                    mode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.5)" : 3,
                  marginBottom: "20px",
                  color:
                    mode === "dark" ? "#E0E0E0" : theme.palette.text.primary,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: "20px",
                    color: mode === "dark" ? "#FFFFFF" : "inherit",
                    fontWeight: 600,
                  }}
                >
                  Document Risk Trends
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={riskTrends}
                    style={{
                      backgroundColor: chartThemeColors.backgroundColor,
                    }}
                    margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid stroke={chartThemeColors.gridColor} />
                    <XAxis
                      dataKey="month"
                      stroke={chartThemeColors.textColor}
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis
                      domain={[0, 5]} // Assuming risk scores range from 0 to 5
                      stroke={chartThemeColors.textColor}
                      label={{
                        value: "Average Risk",
                        angle: -90,
                        position: "insideLeft",
                        fill: chartThemeColors.textColor,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          chartThemeColors.tooltipBackgroundColor,
                        color: chartThemeColors.tooltipTextColor,
                        border: "none",
                        borderRadius: "4px",
                        boxShadow:
                          mode === "dark"
                            ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                            : "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="averageRisk"
                      stroke={
                        mode === "dark" ? "#90CAF9" : theme.palette.primary.main
                      }
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReportLibrary;
