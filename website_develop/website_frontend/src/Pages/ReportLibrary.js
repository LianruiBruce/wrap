import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import FlagIcon from "@mui/icons-material/Flag";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
} from "recharts";
import Header from "../Components/LibraryHeader";
import LibraryNavigator from "../Components/LibraryNavigator";

function ReportLibrary() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [riskScoreData, setRiskScoreData] = useState([]);
  const [riskLevelData, setRiskLevelData] = useState([]);
  const navigate = useNavigate();

  const handleDocumentClick = async (documentID) => {
    try {
      const token = localStorage.getItem("token");
      navigate("/mainpage");
      const response = await fetch("http://localhost:3000/response-docID", {
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

  const getColor = (score) => {
    if (score <= 2) return "green";
    if (score <= 3.5) return "orange";
    return "red";
  };

  const getColorForRiskLevel = (riskLevel) => {
    switch (riskLevel) {
      case "Low":
        return "green";
      case "Medium":
        return "orange";
      case "High":
        return "red";
      default:
        return "#8884d8";
    }
  };

  const toggleFlag = async (documentID) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/toggleFlagOfDoc", {
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
        setFilteredDocuments((prevFiltered) =>
          prevFiltered.map((doc) =>
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
      const response = await fetch("http://localhost:3000/download-pdf", {
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
    if (showFlaggedOnly) {
      // Show all documents
      setFilteredDocuments(documents);
    } else {
      // Filter only flagged documents
      const flaggedDocs = documents.filter((doc) => doc.flagStatus);
      setFilteredDocuments(flaggedDocs);
    }
    setShowFlaggedOnly((prev) => !prev); // Toggle the state
  };

  const handleFilterChange = (filteredDocs) => {
    setFilteredDocuments(filteredDocs);
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
      const response = await fetch("http://localhost:3000/delete-doc", {
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
        setFilteredDocuments(updatedDocuments);
      } else {
        console.error("Failed to delete document:", data.message);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/user-documents", {
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
        const riskLevelCounts = { Low: 0, Medium: 0, High: 0 };

        const documentsWithRisk = await Promise.all(
          data.map(async (doc) => {
            let overallRiskLevel = "Low"; // Default to Low
            let overallScore = 0;

            if (typeof doc.risky === "string") {
              try {
                doc.risky = JSON.parse(doc.risky); // Parse string into JSON array
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

              if (overallScore <= 2) {
                overallRiskLevel = "Low";
              } else if (overallScore <= 3.5) {
                overallRiskLevel = "Medium";
              } else {
                overallRiskLevel = "High";
              }
            }

            riskLevelCounts[overallRiskLevel] += 1;

            // Fetch the flag status for each document
            const flagResponse = await fetch(
              "http://localhost:3000/getFlagOfDoc",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ docID: doc.DocumentID }),
              }
            );

            const flagData = await flagResponse.json();
            const flagStatus = flagData.success ? flagData.flag : false;

            documentCount += 1;

            return { ...doc, overallRiskLevel, overallScore, flagStatus };
          })
        );

        setDocuments(documentsWithRisk);
        setFilteredDocuments(documentsWithRisk);

        // Process data for the chart
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

        // Convert to array for Recharts
        const chartDataArray = Object.keys(reportsPerMonth)
          .map((month) => ({
            month,
            reports: reportsPerMonth[month],
          }))
          .sort((a, b) => {
            // Sort the months chronologically
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA - dateB;
          });

        setChartData(chartDataArray);

        // Prepare data for the risk score chart
        const averageRiskScores = riskCategories.map((category) => ({
          category,
          averageScore:
            documentCount > 0 ? totalRiskScores[category] / documentCount : 0,
        }));

        setRiskScoreData(averageRiskScores);

        // Prepare data for the risk level distribution chart
        const riskLevelDataArray = Object.keys(riskLevelCounts).map(
          (level) => ({
            name: level,
            value: riskLevelCounts[level],
          })
        );

        setRiskLevelData(riskLevelDataArray);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    }

    fetchDocuments();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header Section */}
      <Header
        documents={documents}
        onFilterChange={handleFilterChange}
        onToggleFlaggedFilter={toggleFlaggedFilter}
        showFlaggedOnly={showFlaggedOnly}
      />

      {/* Main Content */}
      <Grid container spacing={3} sx={{ maxWidth: "1200px", width: "100%" }}>
        {/* Sidebar navigator */}
        <Grid item xs={collapsed ? 1 : 2}>
          <LibraryNavigator collapsed={collapsed} />
        </Grid>

        {/* Content and Charts */}
        <Grid item xs={collapsed ? 11 : 10}>
          <Grid container spacing={3}>
            {/* Documents List */}
            <Grid item xs={8}>
              {filteredDocuments.length === 0 ? (
                <Typography>No documents found.</Typography>
              ) : (
                filteredDocuments.map((doc) => (
                  <Box
                    key={doc.DocumentID}
                    onClick={() => handleDocumentClick(doc.DocumentID)}
                    sx={{
                      marginBottom: "15px",
                      padding: "19px",
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minHeight: "120px",
                      margin: "15px auto",
                      cursor: "pointer",
                    }}
                  >
                    {/* Document Info */}
                    <Box
                      sx={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <DescriptionIcon
                        sx={{
                          fontSize: "4rem",
                          marginRight: "20px",
                          color: "#3b3b3b",
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
                        >
                          {doc.companyName}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {`Contract of ${doc.documentType}; ${new Date(
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
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "1rem",
                            }}
                          >
                            {doc.overallRiskLevel}
                          </Typography>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFlag(doc.DocumentID);
                            }}
                            sx={{ marginLeft: "20px" }}
                          >
                            {doc.flagStatus ? (
                              <FlagIcon
                                sx={{ color: "#f44336", fontSize: "2rem" }}
                              />
                            ) : (
                              <FlagOutlinedIcon
                                sx={{ color: "#7a7a7a", fontSize: "2rem" }}
                              />
                            )}
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDocumentDownload(doc.DocumentID);
                        }}
                        sx={{
                          color: "#7a7a7a",
                          "&:hover": { color: "#3b3b3b" },
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
                          color: "#e57373",
                          "&:hover": { color: "#d32f2f" },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: "2rem" }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              )}
            </Grid>

            {/* Charts Section */}
            <Grid item xs={4}>
              {/* Modified Line Chart */}
              <Box
                sx={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                  Reports Generated Per Month
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="reports"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              {/* Risk Scores Chart */}
              <Box
                sx={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                  Average Risk Scores by Category
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={riskScoreData}>
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="averageScore" fill="#82ca9d">
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

              {/* Risk Level Distribution Pie Chart */}
              <Box
                sx={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                  Risk Level Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={riskLevelData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {riskLevelData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getColorForRiskLevel(entry.name)}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
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
