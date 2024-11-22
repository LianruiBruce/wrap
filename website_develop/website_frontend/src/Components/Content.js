// Content.js

import ClearIcon from "@mui/icons-material/Clear";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Divider,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Fuse from "fuse.js";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./Content.css";

export default function Content({ isDocumentSettingsClicked }) {
  // State variables
  const [reportData, setReportData] = useState({
    category: "Legal Category",
    company: "Company",
    date: "2024/03/28",
  });

  const [categoryLabelsData, setCategoryLabelsData] = useState([]); // Changed to store data
  const [summaryContentRef, setSummaryContentRef] = useState("");
  const [riskAssessmentContent, setRiskAssessmentContent] = useState([]);
  const [currentDocumentID, setCurrentDocumentID] = useState(null);
  const [rendered, setRendered] = useState(false);
  const [sections, setSections] = useState(null);
  const [originalDocument, setOriginalDocument] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  // New state variable to store parsed document elements
  const [documentElements, setDocumentElements] = useState([]);

  // Search-related state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [resultsLimit, setResultsLimit] = useState(5); // Limit results
  const [searchHistory, setSearchHistory] = useState([]);

  // Reference to the search input
  const searchInputRef = useRef(null);

  // Reference to the scrollable content container
  const contentContainerRef = useRef(null);

  // State to store Fuse instance and flatContent
  const [fuse, setFuse] = useState(null);
  const [flatContent, setFlatContent] = useState([]);

  // State for showing the Scroll to Top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // State to manage highlighted sentence and search word
  const [highlightedSentenceIdx, setHighlightedSentenceIdx] = useState(null);
  const [highlightedSearchWord, setHighlightedSearchWord] = useState("");

  // Font size state
  const [fontSize, setFontSize] = useState(
    JSON.parse(localStorage.getItem("fontSize")) || 16 // Default to 16px
  );

  // Import the theme
  const theme = useTheme();

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

  const toggleExplanation = () => {
    setShowExplanation((prev) => !prev);
  };

  // Parse the original document into documentElements whenever originalDocument changes
  useEffect(() => {
    const parseDocument = () => {
      let elements = [];

      // Try to parse originalDocument as JSON
      try {
        const parsedContent = JSON.parse(originalDocument);
        // Validate and set documentElements
        if (Array.isArray(parsedContent)) {
          elements = parsedContent;
        } else {
          elements = [{ tag: "p", content: originalDocument }];
        }
      } catch (e) {
        // If not JSON, treat as plain text
        elements = [{ tag: "p", content: originalDocument }];
      }

      // Assign indices
      let globalIndex = 0;
      const assignIndices = (elements) => {
        elements.forEach((element) => {
          if (element.content) {
            element.idx = globalIndex++;
          }
          if (element.children) {
            assignIndices(element.children);
          }
        });
      };
      assignIndices(elements);

      setDocumentElements(elements);
    };

    parseDocument();
  }, [originalDocument]);

  // Initialize Fuse.js whenever documentElements change
  useEffect(() => {
    if (documentElements.length > 0) {
      // Flatten the content for searching
      const flatContent = flattenContent(documentElements);
      setFlatContent(flatContent); // Store flatContent in state
      const fuseOptions = {
        keys: ["content", "tokens"],
        includeScore: true,
        threshold: 0.4,
        ignoreLocation: true,
        includeMatches: true,
        minMatchCharLength: 2,
        shouldSort: true,
      };
      const newFuse = new Fuse(flatContent, fuseOptions);
      setFuse(newFuse);
    }
  }, [documentElements]);

  // Function to flatten content and use assigned idx
  const flattenContent = (elements, flatArray = []) => {
    elements.forEach((element) => {
      if (element.content) {
        // Use the existing idx
        // Tokenize the content into words
        const tokens = element.content.match(/\b(\w+)\b/g); // Extract words
        flatArray.push({
          ...element,
          idx: element.idx,
          tokens: tokens,
        });
      }
      if (element.children) {
        flattenContent(element.children, flatArray);
      }
    });
    return flatArray;
  };

  const getRiskLevel = (score) => {
    if (score > 4) return "Critical";
    if (score > 3) return "High";
    if (score > 2) return "Moderate";
    if (score > 1) return "Low";
    return "Very Low";
  };

  // Fuzzy search function using Fuse.js
  const fuzzySearch = (searchWord) => {
    if (!fuse || !searchWord) return [];

    const results = fuse.search(searchWord).map(({ item, score, matches }) => ({
      sentence: item.content,
      idx: item.idx,
      score,
      matches,
    }));

    // Sort by score
    const sortedResults = results.sort((a, b) => a.score - b.score);

    return sortedResults;
  };

  // Handle search input changes and perform fuzzy search
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const matchingSentences = fuzzySearch(query);
      setSearchResults(matchingSentences);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = (result) => {
    scrollToSentence(result.idx);
    saveSearchToHistory(result, searchQuery);
    setSearchResults([]); // Hide search results after clicking a result
    setHighlightedSentenceIdx(result.idx);
    setHighlightedSearchWord(result.searchWord || searchQuery);
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchClick = () => {
    if (!searchQuery) {
      setSearchResults(
        searchHistory.map((historyItem) => ({
          ...historyItem,
          isHistory: true,
        }))
      );
    }
  };

  // Scroll to a sentence when clicked
  const scrollToSentence = (idx) => {
    const sentenceElement = document.getElementById(`sentence-${idx}`);
    if (sentenceElement) {
      sentenceElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const saveSearchToHistory = (result, searchWord) => {
    if (result && !searchHistory.some((item) => item.idx === result.idx)) {
      setSearchHistory((prevHistory) => [
        ...prevHistory,
        { ...result, searchWord },
      ]);
    }
  };

  // Function to escape special regex characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // Function to highlight matched substrings in a sentence
  const highlightMatch = (text, matches, searchWord) => {
    const escapedSearchWord = escapeRegExp(searchWord);

    if ((!matches || matches.length === 0) && searchWord) {
      // Highlight using searchWord
      const regex = new RegExp(`(${escapedSearchWord})`, "gi");
      const parts = text.split(regex);
      return parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            style={{ backgroundColor: theme.palette.action.selected }}
          >
            {part}
          </mark>
        ) : (
          part
        )
      );
    }

    if (!matches || matches.length === 0) return [text];

    let result = [];
    let lastIndex = 0;

    matches.forEach((match) => {
      if (match.key !== "content") return;
      match.indices.forEach(([start, end]) => {
        // Add text before the match
        if (lastIndex < start) {
          result.push(text.substring(lastIndex, start));
        }
        // Add the highlighted match
        result.push(
          <mark
            key={start}
            style={{ backgroundColor: theme.palette.action.selected }}
          >
            {text.substring(start, end + 1)}
          </mark>
        );
        lastIndex = end + 1;
      });
    });

    // Add remaining text after the last match
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }

    return result;
  };

  const highlightAllOccurrences = (text, searchWord) => {
    if (!searchWord) return text;

    const escapedSearchWord = escapeRegExp(searchWord);
    const regex = new RegExp(`(${escapedSearchWord})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{ backgroundColor: theme.palette.action.selected }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const renderSearchResults = () => {
    const resultsToShow = searchResults.slice(0, resultsLimit);

    return (
      <Paper
        elevation={3}
        style={{
          position: "absolute",
          zIndex: 1,
          width: "100%",
          maxHeight: "250px",
          overflowY: "auto",
          marginTop: "8px",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <List>
          {resultsToShow.length > 0 ? (
            resultsToShow.map((result, idx) => (
              <ListItem
                button
                key={idx}
                onClick={() => handleSearchResultClick(result)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>
                  {/* Highlight user's input in the search results */}
                  {result.isHistory
                    ? result.sentence
                    : highlightAllOccurrences(
                        result.sentence,
                        result.searchWord || searchQuery
                      )}
                </Typography>
              </ListItem>
            ))
          ) : (
            <ListItem style={{ padding: "10px" }}>
              <Typography variant="body2" color="textSecondary">
                No results found
              </Typography>
            </ListItem>
          )}
          {searchResults.length > resultsLimit && (
            <Button
              onClick={() => setResultsLimit(resultsLimit + 5)}
              fullWidth
              variant="text"
              style={{ marginTop: "10px" }}
            >
              Load more results
            </Button>
          )}
        </List>
      </Paper>
    );
  };

  // Add event listener to detect clicks outside the search bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add scroll event listener to show/hide Scroll to Top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const socket = io.connect("https://wrapcapstone.com/", {
      query: { token: token },
    });

    console.log("Attempting to connect to WebSocket server");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("reportGenerated", (report) => {
      setOriginalDocument(report.original_document);
      console.log("section  is: ", report.sections);
      setSections(report.sections);

      const section_summary = JSON.parse(report.section_summary);
      const formattedSectionSummary = section_summary.map((section, index) => {
        const key = Object.keys(section)[0];
        const summary = section[key].Summary;

        return { key, summary };
      });

      setCategoryLabelsData(formattedSectionSummary); // Store data

      setSummaryContentRef(report.general_summary);

      const risk_assessment = JSON.parse(report.risk_assessment);
      const formattedRiskAssessment = risk_assessment.map((risk, index) => {
        const key = Object.keys(risk)[0];
        const riskLabel = risk[key];

        return {
          key,
          label: key,
          initialDashArray: `0, 100`,
          targetDashArray: `${(riskLabel.Score / 5) * 100}, 100`,
          color: getColor(riskLabel.Score),
          score: riskLabel.Score,
          explanation: riskLabel.Explanation,
        };
      });

      setRiskAssessmentContent(formattedRiskAssessment);
      setCurrentDocumentID(report.documentID);
      setRendered(true);
    });

    socket.on("documentDeleted", async (data) => {
      const { documentID: deletedDocumentID } = data;
      console.log("current doc id is " + currentDocumentID);
      console.log("deleted doc id is " + deletedDocumentID);
      if (currentDocumentID === deletedDocumentID) {
        console.log("Current document was deleted, clearing the report data.");

        // Clear all data fields to avoid bugs
        setOriginalDocument(""); // Empty document content
        setSections([]); // Reset sections to empty array
        setCategoryLabelsData([]); // Reset section summary to empty array
        setSummaryContentRef(""); // Reset general summary to an empty string
        setRiskAssessmentContent([]); // Reset risk assessment to empty array
        setCurrentDocumentID(null); // Clear the current document ID
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socket.on("selectDocument", (selectInfo) => {
      setOriginalDocument(selectInfo.original_document);
      setSections(selectInfo.sections);

      const section_summary = JSON.parse(selectInfo.section_summary);

      const formattedSectionSummary = section_summary.map((section, index) => {
        const key = Object.keys(section)[0];
        const summary = section[key].Description;

        return { key, summary };
      });

      setCategoryLabelsData(formattedSectionSummary); // Store data

      setSummaryContentRef(selectInfo.general_summary);

      const risk_assessment = JSON.parse(selectInfo.risk_assessment);

      const formattedRiskAssessment = risk_assessment.map((risk, index) => {
        const key = Object.keys(risk)[0];
        const riskLabel = risk[key];

        return {
          key,
          label: key,
          initialDashArray: `0, 100`,
          targetDashArray: `${(riskLabel.Score / 5) * 100}, 100`,
          color: getColor(riskLabel.Score),
          score: riskLabel.Score,
          explanation: riskLabel.Explanation,
        };
      });

      setRiskAssessmentContent(formattedRiskAssessment);
      setRendered(false);
      setCurrentDocumentID(selectInfo.documentID);
      setTimeout(() => setRendered(true), 250);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return () => {
      console.log("Disconnecting WebSocket");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentDocumentID) {
      console.log(
        "Current document ID has been updated to:",
        currentDocumentID
      );
    }
  }, [currentDocumentID]);

  useEffect(() => {
    if (rendered) {
      const timer = setTimeout(() => {
        setRiskAssessmentContent(
          (prevState) =>
            Array.isArray(prevState)
              ? prevState.map((item) => ({
                  ...item,
                  initialDashArray: item.targetDashArray,
                }))
              : [] // If prevState is not an array, set it to an empty array
        );
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [rendered, riskAssessmentContent]);

  function getColor(value) {
    let red, green;

    if (value <= 2.5) {
      red = Math.floor((value / 2.5) * 255);
      green = 255;
    } else {
      red = 255;
      green = Math.floor(255 - ((value - 2.5) / 2.5) * 255);
    }

    return `rgb(${red}, ${green}, 0)`;
  }

  // Styles
  const titleStyle = {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    fontSize: `${fontSize * 1.5}px`, // Adjusted font size for titles
  };

  const helpIconStyle = {
    color: "primary.main",
    position: "absolute",
    right: 16,
  };

  const paperStyle = {
    boxShadow: 3,
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  };

  // Function to render the legal document with explanations
  const renderLegalDocument = () => {
    try {
      const parsedContent = documentElements;
      const parsedSections = sections ? JSON.parse(sections) : [];

      const getSectionSummary = (header) => {
        const match = parsedSections.find(
          (section) => section.header === header
        );
        return match ? match.content : null;
      };

      const getVariantForHeader = (tag) => {
        switch (tag) {
          case "h1":
            return "h5";
          case "h2":
            return "h6";
          case "h3":
            return "h6";
          case "h4":
            return "subtitle2";
          case "h5":
            return "subtitle2";
          case "h6":
            return "body1";
          default:
            return "body1";
        }
      };

      const getFontSizeForHeader = (tag) => {
        switch (tag) {
          case "h1":
            return `${fontSize * 2.5}px`;
          case "h2":
            return `${fontSize * 2}px`;
          case "h3":
            return `${fontSize * 1.75}px`;
          case "h4":
            return `${fontSize * 1.5}px`;
          case "h5":
            return `${fontSize * 1.25}px`;
          case "h6":
            return `${fontSize}px`;
          default:
            return `${fontSize}px`;
        }
      };

      const titleList = parsedContent
        .filter((element) => element.tag.match(/^h[1-6]$/))
        .map((element) => ({
          tag: element.tag,
          content: element.content,
          idx: element.idx,
        }));

      const scrollToTitle = (idx) => {
        const targetElement = document.getElementById(`sentence-${idx}`);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      };

      const renderDirectory = () => (
        <Box
          sx={{
            padding: 2,
            marginBottom: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
            Table of Contents
          </Typography>
          <List>
            {titleList.map((title, index) => (
              <ListItem
                button
                key={index}
                onClick={() => scrollToTitle(title.idx)}
                sx={{
                  padding: 1,
                  paddingLeft: `${(parseInt(title.tag[1], 10) - 1) * 16}px`,
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: `${
                      fontSize * (1.1 - parseInt(title.tag[1], 10) * 0.1)
                    }px`,
                  }}
                >
                  {title.content}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      );

      const renderElementsWithExplanations = (elements) => {
        const contentSections = [];
        let currentSection = { header: null, content: [] };

        elements.forEach((element) => {
          if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(element.tag)) {
            if (currentSection.header || currentSection.content.length > 0) {
              contentSections.push(currentSection);
            }
            currentSection = { header: element.content, content: [] };
          }
          currentSection.content.push(element);
        });
        if (currentSection.header || currentSection.content.length > 0) {
          contentSections.push(currentSection);
        }

        return contentSections.map((section, index) => {
          const summary = getSectionSummary(section.header);

          return (
            <React.Fragment key={index}>
              {/* Left side: Headers and content */}
              <div>
                {section.content.map((element) => {
                  const idx = element.idx;
                  const isHighlightedSentence = idx === highlightedSentenceIdx;

                  const commonProps = {
                    key: idx,
                    id: `sentence-${idx}`,
                    style: {
                      fontSize: getFontSizeForHeader(element.tag),
                      ...(isHighlightedSentence && {
                        backgroundColor: theme.palette.action.hover,
                      }),
                      ...(element.tag.match(/^h[1-6]$/) && {
                        fontWeight: "bold",
                      }),
                    },
                  };

                  let contentToRender = element.content;

                  if (isHighlightedSentence && highlightedSearchWord) {
                    contentToRender = highlightAllOccurrences(
                      element.content,
                      highlightedSearchWord
                    );
                  }

                  switch (element.tag) {
                    case "h1":
                    case "h2":
                    case "h3":
                    case "h4":
                    case "h5":
                    case "h6":
                      return (
                        <React.Fragment key={idx}>
                          <Typography
                            variant={getVariantForHeader(element.tag)}
                            gutterBottom
                            style={{
                              fontWeight: "bold",
                              marginBottom: "10px",
                              marginTop: "10px",
                              fontSize: getFontSizeForHeader(element.tag),
                            }}
                            {...commonProps}
                          >
                            {contentToRender}
                          </Typography>
                          <Divider />
                          <br />
                        </React.Fragment>
                      );
                    case "p":
                      return (
                        <Typography
                          variant="body1"
                          style={{
                            marginBottom: "1.5em",
                            lineHeight: "1.6",
                            whiteSpace: "pre-wrap",
                            fontSize: `${fontSize}px`,
                          }}
                          {...commonProps}
                        >
                          {contentToRender}
                        </Typography>
                      );
                    case "li":
                      return (
                        <li
                          style={{
                            marginBottom: "0.5em",
                            lineHeight: "1.5",
                            fontSize: `${fontSize}px`,
                          }}
                          {...commonProps}
                        >
                          {contentToRender}
                        </li>
                      );
                    case "blockquote":
                      return (
                        <blockquote
                          style={{
                            borderLeft: `4px solid ${theme.palette.divider}`,
                            paddingLeft: "16px",
                            marginBottom: "1.5em",
                            fontStyle: "italic",
                            color: theme.palette.text.secondary,
                            fontSize: `${fontSize}px`,
                          }}
                          {...commonProps}
                        >
                          <Typography variant="body1">
                            {contentToRender}
                          </Typography>
                        </blockquote>
                      );
                    case "ul":
                      return (
                        <ul
                          style={{
                            marginLeft: "20px",
                            fontSize: `${fontSize}px`,
                          }}
                          {...commonProps}
                        >
                          {element.children &&
                            renderElementsWithExplanations(element.children)}
                        </ul>
                      );
                    case "ol":
                      return (
                        <ol
                          style={{
                            marginLeft: "20px",
                            fontSize: `${fontSize}px`,
                          }}
                          {...commonProps}
                        >
                          {element.children &&
                            renderElementsWithExplanations(element.children)}
                        </ol>
                      );
                    default:
                      return (
                        <Typography
                          variant="body1"
                          style={{
                            marginBottom: "1.5em",
                            lineHeight: "1.6",
                            fontSize: `${fontSize}px`,
                          }}
                          {...commonProps}
                        >
                          {contentToRender}
                        </Typography>
                      );
                  }
                })}
              </div>

              {/* Right side: Summary vertically centered */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: "50px",
                  padding: "10px 0",
                }}
              >
                {summary && (
                  <Typography
                    variant="body2"
                    style={{
                      color: theme.palette.text.secondary,
                      fontSize: `${fontSize}px`,
                    }}
                  >
                    {summary}
                  </Typography>
                )}
              </div>
            </React.Fragment>
          );
        });
      };

      // Main rendering function
      return (
        <>
          {renderDirectory()}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 1fr",
              gap: "20px",
            }}
          >
            {renderElementsWithExplanations(parsedContent)}
          </div>
        </>
      );
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return (
        <Typography variant="body1" style={{ fontSize: `${fontSize}px` }}>
          {originalDocument}
        </Typography>
      );
    }
  };

  // Clear highlighted sentence after a certain time
  useEffect(() => {
    if (highlightedSentenceIdx !== null) {
      const timer = setTimeout(() => {
        setHighlightedSentenceIdx(null);
        setHighlightedSearchWord("");
      }, 5000); // Clear after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [highlightedSentenceIdx]);

  return (
    <Box sx={{ height: "100%", overflow: "hidden", padding: 2 }}>
      {isDocumentSettingsClicked && (
        <>
          {/* Search Bar */}
          <Box
            sx={{ position: "relative", marginBottom: 2 }}
            ref={searchInputRef}
          >
            <TextField
              placeholder="Search in document..."
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={handleSearchClick}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} edge="end">
                      <ClearIcon color="action" />
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  borderRadius: "25px",
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[1],
                  color: theme.palette.text.primary,
                },
              }}
            />
            {searchResults.length > 0 && renderSearchResults()}
          </Box>

          <Grid container sx={{ height: "calc(100% - 70px)" }}>
            <Grid item xs={12} sx={{ height: "100%" }}>
              <Paper sx={{ ...paperStyle }}>
                {/* Header Section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    position: "relative",
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={titleStyle}>
                    Original Document
                  </Typography>
                </Box>
                {/* Scrollable Content */}
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    p: 3,
                  }}
                >
                  {renderLegalDocument()}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Scroll to Top Button */}
          {showScrollTop && (
            <Fab
              color="primary"
              size="medium"
              onClick={scrollToTop}
              sx={{
                position: "fixed",
                top: 16,
                right: 16,
                zIndex: 1000,
              }}
            >
              <KeyboardArrowUpIcon />
            </Fab>
          )}
        </>
      )}

      {!isDocumentSettingsClicked && (
        <Grid container spacing={2} sx={{ height: "100%" }}>
          {/* Adjusted Grid items to occupy space perfectly */}
          <Grid
            container
            item
            xs={12}
            spacing={2}
            sx={{
              height: "60vh",
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
            }}
          >
            {/* General Summary */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Paper sx={{ ...paperStyle, flexGrow: 1, height: "100%" }}>
                {/* Header */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" sx={titleStyle}>
                    General Summary
                  </Typography>
                </Box>
                {/* Content */}
                <Box sx={{ p: 2, overflowY: "auto", flexGrow: 1 }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    style={{
                      whiteSpace: "pre-wrap",
                      fontSize: `${fontSize}px`,
                    }}
                  >
                    {summaryContentRef}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Section Summary */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Paper sx={{ ...paperStyle, flexGrow: 1, height: "100%" }}>
                {/* Header */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" sx={titleStyle}>
                    Section Summary
                  </Typography>
                </Box>
                {/* Content */}
                <Box sx={{ p: 2, overflowY: "auto", flexGrow: 1 }}>
                  {(categoryLabelsData || []).map((item, index) => (
                    <div key={index} style={{ marginBottom: "16px" }}>
                      <Typography
                        variant="body1"
                        component="span"
                        style={{
                          fontWeight: "bold",
                          fontSize: `${fontSize * 1.2}px`,
                        }}
                      >
                        {item.key}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        {item.summary}
                      </Typography>
                    </div>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Risk Assessment */}
          <Grid item xs={12} sx={{ display: "flex", flexGrow: 1 }}>
            <Paper sx={{ ...paperStyle, flexGrow: 1 }}>
              {/* Header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6" sx={titleStyle}>
                  Risk Assessment
                </Typography>
                <Tooltip title="Risk Explanation">
                  <IconButton
                    color="inherit"
                    sx={helpIconStyle}
                    onClick={toggleExplanation}
                  >
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              {/* Content */}
              <Box sx={{ p: 2, overflowY: "auto", flexGrow: 1 }}>
                <div className="risk-assessment">
                  {(Array.isArray(riskAssessmentContent)
                    ? riskAssessmentContent
                    : []
                  ).map((item) => {
                    // If showExplanation is true and there's no explanation, skip this item.
                    if (showExplanation && !item.explanation) {
                      return null;
                    }

                    return (
                      <div
                        className="risk-item"
                        data-value={item.score}
                        key={item.key}
                      >
                        {showExplanation ? (
                          <>
                            {/* Label and explanation when explanation is present */}
                            <div
                              style={{
                                marginLeft: "15px",
                                marginRight: "15px",
                              }}
                            >
                              <div
                                className="category-label"
                                style={{ fontSize: `${fontSize * 1.2}px` }} // Increased font size
                              >
                                {item.label}
                              </div>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                style={{ fontSize: `${fontSize}px` }}
                              >
                                {item.explanation}
                              </Typography>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className="category-label"
                              style={{ fontSize: `${fontSize * 1.2}px` }} // Increased font size
                            >
                              {item.label}
                            </div>
                            <svg className="circle-chart" viewBox="0 0 36 36">
                              <path
                                className="circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="circle"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                strokeDasharray={item.initialDashArray}
                                stroke={item.color}
                              />
                            </svg>
                            <div
                              className="risk-label"
                              style={{ fontSize: `${fontSize}px` }}
                            >
                              {`${getRiskLevel(item.score)}`}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
