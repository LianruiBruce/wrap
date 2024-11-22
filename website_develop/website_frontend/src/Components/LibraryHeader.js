// LibraryHeader.js

import React, { useState, useContext } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  InputBase,
  Tooltip,
  useTheme,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";
import FlagIcon from "@mui/icons-material/Flag";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import { ThemeContext } from "../colorTheme/ThemeContext";

// const { mode } = useContext(ThemeContext);
// const headerBackgroundColor =
//   mode === "light" ? "rgb(245, 245, 245)" : "rgb(18, 18, 18)";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "50px",
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  boxShadow: theme.shadows[2],
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.paper, 1),
  },
  marginLeft: 0,
  width: "100%",
  maxWidth: "500px",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 2, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "25ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

function Header({
  documents,
  onFilterChange,
  onToggleFlaggedFilter,
  showFlaggedOnly,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleHistoryClick = () => {
    navigate("/history");
  };
  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);

    const filteredDocuments = documents.filter(
      (doc) =>
        doc.companyName
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        doc.documentType
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
    );

    onFilterChange(filteredDocuments);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: "none",
        padding: "10px 30px",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Group title and search bar in the center */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            flexGrow: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            Report Library
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: theme.palette.text.secondary }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          {/* Flag Toggle Button */}
          <IconButton
            onClick={onToggleFlaggedFilter}
            sx={{ marginLeft: "10px" }}
          >
            {showFlaggedOnly ? (
              <FlagIcon
                sx={{ color: theme.palette.error.main, fontSize: "2rem" }}
              />
            ) : (
              <FlagOutlinedIcon
                sx={{ color: theme.palette.text.secondary, fontSize: "2rem" }}
              />
            )}
          </IconButton>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="risk score">Risk Score</MenuItem>
              </Select>
            </FormControl>

            {sortBy === "date" && (
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="sort-order-label">Sort Order</InputLabel>
                <Select
                  labelId="sort-order-label"
                  value={sortOrder}
                  label="Sort Order"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="newest to oldest">Newest to Oldest</MenuItem>
                  <MenuItem value="oldest to newest">Oldest to Newest</MenuItem>
                </Select>
              </FormControl>
            )}

            {sortBy === "risk score" && (
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="sort-order-label">Sort Order</InputLabel>
                <Select
                  labelId="sort-order-label"
                  value={sortOrder}
                  label="Sort Order"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="high to low">High to Low</MenuItem>
                  <MenuItem value="low to high">Low to High</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>

        {/* Right-aligned icons */}
        <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <IconButton onClick={handleSettingsClick}>
            <SettingsIcon
              sx={{ fontSize: "2rem", color: theme.palette.text.primary }}
            />
          </IconButton>

          <IconButton onClick={handleHistoryClick}>
            <HistoryIcon
              sx={{ fontSize: "2rem", color: theme.palette.text.primary }}
            />
          </IconButton>

          <IconButton onClick={handleProfileClick}>
            <AccountCircleIcon
              sx={{ fontSize: "2rem", color: theme.palette.text.primary }}
            />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
