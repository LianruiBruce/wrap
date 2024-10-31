import React, { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Container,
  CssBaseline,
  Box,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import LibraryNavigator from "../Components/LibraryNavigator";

const theme = createTheme();

export default function Profile() {
  const [flaggedDocumentsCount, setFlaggedDocumentsCount] = useState(0);
  const [numOfUserDocuments, setNumOfUserDocuments] = useState(0);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    createDate: "",
  });

  useEffect(() => {
    fetchNumOfFlags();
    fetchNumOfUserDocuments();
    fetchUserInfo();
  }, []);

  async function fetchNumOfFlags() {
    try {
      const token = localStorage.getItem("token");
      console.log("token" + token);
      console.log(
        "sending request to backend to get number of flagged documents"
      );
      const response = await fetch("http://wrapcapstone.com/num-flags", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch number of flaged documents");
      }
      const userData = await response.json();
      console.log("the number of flaged doc is :", userData);
      setFlaggedDocumentsCount(userData.flagNum);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  //getNumOfUserDoc
  async function fetchNumOfUserDocuments() {
    try {
      const token = localStorage.getItem("token");
      console.log(
        "Sending request to backewrapcapstone.comer of user documents"
      );
      const response = await fetch("http://wrapcapstone.com/getNumOfUserDoc", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch number of user documents");
      }
      const data = await response.json();
      console.log("The number of user documents is:", data.numOfUserDoc);
      setNumOfUserDocuments(data.numOfUserDoc);
    } catch (error) {
      console.error("Error fetching user documents count:", error);
    }
  }

  async function fetchUserInfo() {
    try {
      const token = localStorage.getItem("twrapcapstone.com
      console.log("Fetching user information...");

      const response = await fetch("http://wrapcapstone.com/getUserInfo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user information");
      }

      const { userInfo } = await response.json();
      console.log("User information fetched:", userInfo);
      setUserInfo(userInfo); // Set user info to state
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  }

  // Placeholder user data
  const userData = {
    username: "lianruigeng",
    fullName: userInfo.firstName + " " + userInfo.lastName,
    bio: "I am coding and I hate this.",
    email: userInfo.email,
    avatarUrl: "https://picsum.photos/400/400",
    createdAt: userInfo.createDate,
    reports: numOfUserDocuments,
    flagged: flaggedDocumentsCount,
    comments: 15,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Container matching the ReportLibrary layout */}
      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          paddingTop: "20px",
        }}
      >
        {/* Sidebar navigator */}
        <Grid item xs={1}>
          <LibraryNavigator collapsed={true} />
        </Grid>

        {/* Main Content */}
        <Grid item xs={11}>
          <Container maxWidth="md">
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 3,
                p: 4,
              }}
            >
              <Grid container spacing={4}>
                {/* Left Column */}
                <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                  <Avatar
                    alt={userData.fullName}
                    src={userData.avatarUrl || "/default-avatar.png"}
                    sx={{ width: 150, height: 150, margin: "0 auto" }}
                  />
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    {userData.fullName}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    @{userData.username}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => alert("Edit Profile button clicked!")}
                  >
                    Edit Profile
                  </Button>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} sm={8}>
                  {/* Bio */}
                  <Typography variant="h6">Bio</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {userData.bio || "This user has not added a bio yet."}
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  {/* Additional Information */}
                  <Typography variant="h6">Details</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="textSecondary">
                          Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">
                          {userData.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="textSecondary">
                          Member Since:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">
                          {new Date(userData.createdAt).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      {/* Add more details as needed */}
                    </Grid>
                  </Box>
                  <Divider sx={{ my: 2 }} />

                  {/* Statistics */}
                  <Grid container spacing={2}>
                    <Grid item xs={4} sx={{ textAlign: "center" }}>
                      <Typography variant="h6">Reports</Typography>
                      <Typography variant="h5">{userData.reports}</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "center" }}>
                      <Typography variant="h6">Flagged</Typography>
                      <Typography variant="h5">{userData.flagged}</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "center" }}>
                      <Typography variant="h6">Comments</Typography>
                      <Typography variant="h5">{userData.comments}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
