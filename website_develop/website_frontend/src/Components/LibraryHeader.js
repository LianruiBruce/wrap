import React, { useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Avatar,
  InputBase,
  Tooltip,
  useTheme,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";
import FlagIcon from "@mui/icons-material/Flag";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";


// Custom styled components for search bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "50px",
  backgroundColor: alpha(theme.palette.common.white, 0.85),
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 1),
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
  color: "black",
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
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
        backgroundColor: "transparent",
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
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            Report Library
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: "#666" }} />
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
              <FlagIcon sx={{ color: "#f44336", fontSize: "2rem" }} />
            ) : (
              <FlagOutlinedIcon sx={{ color: "#7a7a7a", fontSize: "2rem" }} />
            )}
          </IconButton>
        </Box>

        {/* Right-aligned icons */}
        <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <IconButton onClick={handleSettingsClick}>
            <SettingsIcon sx={{ fontSize: "2rem", color: "#333" }} />
          </IconButton>

          <IconButton onClick={handleHistoryClick}>
            <HistoryIcon sx={{ fontSize: "2rem", color: "#333" }} />
          </IconButton>

          <IconButton onClick={handleProfileClick}>
            <AccountCircleIcon sx={{ fontSize: "2rem", color: "#333" }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
