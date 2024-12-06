import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  IconButton,
  Stack,
} from "@mui/material";
import { styled } from "@mui/system";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import extensionResultImage from "../Images/screenshot/extension_result.png";
import mainPageImage from "../Images/screenshot/mainpage.png";

// Import all required icons
import ExtensionIcon from "@mui/icons-material/Extension";
import DescriptionIcon from "@mui/icons-material/Description";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SecurityIcon from "@mui/icons-material/Security";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// Define Light and Dark Themes
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#61DAFB",
    },
    secondary: {
      main: "#6B4FBB",
    },
    background: {
      default: "#f0f2f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "rgba(0, 0, 0, 0.7)",
    },
    divider: "rgba(0, 0, 0, 0.12)",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#61DAFB",
    },
    secondary: {
      main: "#6B4FBB",
    },
    background: {
      default: "#000000",
      paper: "#121212",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
});

// Styled Components
const StyledButton = styled(Button)(({ theme, gradient }) => ({
  borderRadius: "8px",
  padding: "12px 24px",
  textTransform: "none",
  fontSize: "1rem",
  background: gradient || "transparent",
  transition: "all 0.3s ease",
  color: theme.palette.text.primary,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const TechStackCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  height: "100%",
  padding: "24px",
  transition: "all 0.3s ease",
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    transform: "translateY(-8px)",
    border: `1px solid ${theme.palette.text.secondary}`,
    boxShadow: theme.shadows[4],
  },
}));

const StyledContainer = styled(Container)({
  position: "relative",
  zIndex: 1,
});

const GradientText = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(45deg, #61DAFB 10%, #6B4FBB 50%, #68A063 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: `0 0 40px ${
    theme.palette.mode === "light"
      ? "rgba(97, 218, 251, 0.3)"
      : "rgba(255, 255, 255, 0.3)"
  }`,
}));

const PageSection = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 0",
  position: "relative",
});

function LandingPage() {
  const [themeMode, setThemeMode] = useState("light");
  const theme = themeMode === "light" ? lightTheme : darkTheme;

  const navigate = useNavigate();

  const workflowSteps = [
    {
      title: "Install Browser Extension",
      description:
        "Add our Chrome extension with a single click to start analyzing legal documents instantly.",
      icon: <ExtensionIcon />,
      details: [
        "Quick installation process",
        "Supports most major browsers",
        "Automatic updates",
        "Lightweight and fast",
      ],
    },
    {
      title: "Select Your Document",
      description:
        "Click the extension icon when viewing any legal document or terms of service you want to analyze.",
      icon: <DescriptionIcon />,
      details: [
        "Works with any legal text",
        "Support for multiple formats",
        "Easy document selection",
        "Privacy preserved",
      ],
    },
    {
      title: "AI Analysis",
      description:
        "Our AI powered by Claude instantly analyzes the document and provides comprehensive insights.",
      icon: <AutoAwesomeIcon />,
      details: [
        "Advanced NLP processing",
        "Key terms identification",
        "Risk assessment",
        "Summary generation",
      ],
    },
    {
      title: "Review Report",
      description:
        "Get a detailed yet easy-to-understand report highlighting key points, obligations, and potential risks.",
      icon: <AssessmentIcon />,
      details: [
        "Clear summaries",
        "Risk highlights",
        "Important clauses",
        "Action items",
      ],
    },
  ];

  const testimonials = [
    {
      quote: "The AI analysis saves us hours of document review time.",
      author: "Xuanhao Mei",
      role: "Technical Art Student",
      company: "University of Utah",
    },
    {
      quote:
        "Wrap has the ability to transform the way we review legal documents.",
      author: "Jiachen Ren",
      role: "3D Modeler",
      company: "Aureum Gale Games",
    },
    {
      quote:
        "Wrap has the potential to help users avoid the risks associated with legal documents.",
      author: "Meiyi Zhang",
      role: "Freelance",
      company: "Shenzhen, China",
    },
  ];

  const stats = [
    {
      value: "90%",
      label: "Time Saved",
      description: "Average reduction in document review time",
    },
    {
      value: "100+",
      label: "Documents Analyzed",
      description: "Legal documents processed through our platform",
    },
    {
      value: "10+",
      label: "Active Users",
      description: "We have tested our project by 10+ users",
    },
    {
      value: "90%",
      label: "Accuracy",
      description: "In identifying key legal terms and conditions",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          background:
            theme.palette.mode === "light"
              ? `
                  radial-gradient(circle at 10% 20%, rgba(255, 105, 180, 0.2) 0%, transparent 20%),
                  radial-gradient(circle at 90% 30%, rgba(255, 165, 0, 0.2) 0%, transparent 20%),
                  radial-gradient(circle at 50% 50%, rgba(60, 179, 113, 0.2) 0%, transparent 20%),
                  radial-gradient(circle at 20% 80%, rgba(65, 105, 225, 0.2) 0%, transparent 20%),
                  #f9fafb
                `
              : `
                  radial-gradient(circle at 10% 20%, rgba(134, 239, 172, 0.08) 0%, transparent 25%),
                  radial-gradient(circle at 90% 30%, rgba(147, 197, 253, 0.08) 0%, transparent 25%),
                  radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.08) 0%, transparent 25%),
                  radial-gradient(circle at 20% 80%, rgba(251, 207, 232, 0.08) 0%, transparent 25%),
                  #030712
                `,
        }}
      >
        {/* Navigation Bar */}
        <AppBar
          position="fixed"
          sx={{
            background: theme.palette.background.paper,
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar>
            <Typography
              variant="h4"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Wrap
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() =>
                setThemeMode((prevMode) =>
                  prevMode === "light" ? "dark" : "light"
                )
              }
              sx={{ mr: 2 }}
            >
              {themeMode === "light" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
            <Box sx={{ display: "flex", gap: 2 }}>
              <StyledButton
                variant="text"
                onClick={() => navigate("/team")}
                sx={{ color: theme.palette.text.primary }}
              >
                Team
              </StyledButton>
              <StyledButton
                variant="text"
                onClick={() => navigate("/login")}
                sx={{ color: theme.palette.text.primary }}
              >
                Login
              </StyledButton>
              <StyledButton
                variant="contained"
                onClick={() => navigate("/signup")}
                sx={{
                  background:
                    "linear-gradient(45deg, #61DAFB 10%, #6B4FBB 90%)",
                  color: "white",
                }}
              >
                Sign Up
              </StyledButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box>
          {/* Hero Section */}
          <PageSection>
            <StyledContainer maxWidth="lg">
              <GradientText
                variant="h1"
                align="center"
                sx={{
                  fontSize: { xs: "2.5rem", md: "4.5rem" },
                  fontWeight: "bold",
                  mb: 3,
                }}
              >
                Simplify Legal Documents with{" "}
                <span style={{ color: "#61DAFB" }}>Wrap</span>
              </GradientText>
              <Typography
                variant="h5"
                align="center"
                sx={{
                  mb: 6,
                  color: theme.palette.text.secondary,
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                AI and NLP models powered legal document analysis that helps you
                understand terms and conditions in seconds
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <StyledButton
                  gradient="linear-gradient(45deg, #61DAFB 10%, #6B4FBB 90%)"
                  size="large"
                  onClick={() => navigate("/signup")}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: "white" }}
                >
                  Get Started Free
                </StyledButton>
                <StyledButton
                  component="a"
                  href="https://www.youtube.com/watch?v=n71UerF7SUk"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider,
                    "&:hover": {
                      borderColor: theme.palette.text.primary,
                    },
                  }}
                >
                  View Demo
                </StyledButton>
                <StyledButton
                  component="a"
                  href="https://drive.google.com/file/d/1nridL8YNknQwpetn9mXtM3sKLg07z_k_/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="large"
                  startIcon={<DownloadIcon />}
                  sx={{
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider,
                    "&:hover": {
                      borderColor: theme.palette.text.primary,
                    },
                  }}
                >
                  Download Extension(.zip)
                </StyledButton>
                <StyledButton
                  component="a"
                  href="https://chromewebstore.google.com/detail/wrap/pmaajlkakfpenkopkmhlepopeipgjpgn"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="large"
                  startIcon={<DownloadIcon />}
                  sx={{
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider,
                    "&:hover": {
                      borderColor: theme.palette.text.primary,
                    },
                  }}
                >
                  Add from Chrome Extension Store
                </StyledButton>
              </Box>
            </StyledContainer>
          </PageSection>
          {/* How It Works Section */}
          <PageSection>
            <StyledContainer maxWidth="lg">
              <Typography variant="h2" align="center" sx={{ mb: 2 }}>
                How It Works
              </Typography>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  mb: 8,
                  color: theme.palette.text.secondary,
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                Transform complex legal documents into clear, actionable
                insights in four simple steps
              </Typography>

              <Grid container spacing={6}>
                {workflowSteps.map((step, index) => (
                  <Grid item xs={12} md={6} lg={3} key={index}>
                    <Box
                      sx={{
                        background: theme.palette.background.paper,
                        borderRadius: "16px",
                        p: 3,
                        height: "100%",
                        position: "relative",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: -20,
                          left: -20,
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(45deg, #61DAFB, #6B4FBB)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </Box>

                      <Box
                        sx={{
                          mb: 3,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {React.cloneElement(step.icon, {
                          sx: { fontSize: 48, color: "#61DAFB" },
                        })}
                      </Box>

                      <Typography variant="h5" gutterBottom align="center">
                        {step.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          mb: 3,
                          textAlign: "center",
                        }}
                      >
                        {step.description}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {step.details.map((detail, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: "#61DAFB",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              {detail}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </StyledContainer>
          </PageSection>

          {/* Demo Section */}
          <PageSection>
            <StyledContainer maxWidth="lg">
              <Typography variant="h2" align="center" sx={{ mb: 2 }}>
                See Wrap in Action
              </Typography>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  mb: 8,
                  color: theme.palette.text.secondary,
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                Experience how Wrap transforms complex legal documents into
                clear, actionable insights
              </Typography>

              {/* Extension Analysis Demo */}
              <Grid container spacing={6} alignItems="center" sx={{ mb: 12 }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography variant="h4" gutterBottom>
                      Quick Document Analysis
                    </Typography>
                    <Typography
                      sx={{ mb: 4, color: theme.palette.text.secondary }}
                    >
                      Simply click the Wrap extension icon when viewing any
                      legal document. Our NLP models provide instant analysis
                      with:
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {[
                        "Readability score for document complexity",
                        "Risk assessment across multiple dimensions",
                        "Average 10-20 seconds to complete analysis",
                      ].map((text, index) => (
                        <Box
                          key={index}
                          sx={{ display: "flex", gap: 2, alignItems: "center" }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "#61DAFB",
                            }}
                          />
                          <Typography>{text}</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Card
                      sx={{
                        mt: 4,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: "green",
                            }}
                          />
                          <Typography variant="subtitle2" color="textSecondary">
                            Active Analysis
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          "Wrap automatically detects legal documents and begins
                          analysis as soon as you navigate to them. No
                          copy-pasting required!"
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      overflow: "hidden",
                      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                      borderRadius: "24px",
                      maxWidth: "400px", // Limit width
                      mx: "auto", // Center the card
                      backgroundColor: "white",
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      <img
                        src={extensionResultImage}
                        alt="Wrap extension analysis"
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                          borderRadius: "12px",
                        }}
                      />
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              {/* Detailed Report Demo */}
              <Grid container spacing={6} alignItems="center">
                <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
                  <Card
                    sx={{
                      overflow: "hidden",
                      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                      borderRadius: "24px",
                      maxWidth: "600px", // Increased max-width for report
                      mx: "auto",
                      backgroundColor: "white",
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      <img
                        src={mainPageImage}
                        alt="Wrap detailed report"
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                          borderRadius: "12px",
                        }}
                      />
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography variant="h4" gutterBottom>
                      Comprehensive Reports
                    </Typography>
                    <Typography
                      sx={{ mb: 4, color: theme.palette.text.secondary }}
                    >
                      Get detailed insights with our comprehensive report view.
                      Each analysis includes:
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {[
                        "Section-by-section breakdown with summaries",
                        "Important clauses and obligations highlighted",
                        "Visual risk indicators for quick assessment",
                      ].map((text, index) => (
                        <Box
                          key={index}
                          sx={{ display: "flex", gap: 2, alignItems: "center" }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "#6B4FBB",
                            }}
                          />
                          <Typography>{text}</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Card
                      sx={{
                        mt: 4,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: "#6B4FBB",
                            }}
                          />
                          <Typography variant="subtitle2" color="textSecondary">
                            Smart Summary
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          "Our NLP models and AI provide intelligent summaries
                          that highlight the most important aspects of each
                          document section, helping you understand complex legal
                          language quickly."
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              </Grid>
            </StyledContainer>
          </PageSection>

          {/* Tech Stack Section */}
          <PageSection>
            <StyledContainer maxWidth="lg">
              <Box sx={{ pt: 24, pb: 12 }}>
                <Typography variant="h2" align="center" sx={{ mb: 2 }}>
                  Our Tech Stack
                </Typography>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    mb: 8,
                    color: theme.palette.text.secondary,
                    maxWidth: "800px",
                    mx: "auto",
                  }}
                >
                  Built with cutting-edge technologies to provide a secure,
                  scalable, and efficient solution
                </Typography>

                {/* NLP Pipeline Section */}
                <Box sx={{ mb: 12 }}>
                  <Typography variant="h4" sx={{ mb: 4, color: "#FF4B4B" }}>
                    NLP Pipeline
                  </Typography>
                  <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h5" gutterBottom>
                        Advanced Language Models
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 4,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        Our pipeline combines four powerful transformer models,
                        each specialized for a specific aspect of legal document
                        analysis
                      </Typography>

                      {/* Model Cards */}
                      <Stack spacing={3}>
                        <Card
                          sx={{
                            p: 3,
                            background: `linear-gradient(135deg, ${alpha(
                              "#FF4B4B",
                              0.05
                            )}, ${alpha("#FF4B4B", 0.1)})`,
                            border: "1px solid",
                            borderColor: alpha("#FF4B4B", 0.1),
                          }}
                        >
                          <Typography variant="subtitle1" gutterBottom>
                            Document Classification
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            BART-large-MNLI (175M parameters) provides zero-shot
                            classification capabilities to identify document
                            types and key sections
                          </Typography>
                        </Card>

                        <Card
                          sx={{
                            p: 3,
                            background: `linear-gradient(135deg, ${alpha(
                              "#FF8A3D",
                              0.05
                            )}, ${alpha("#FF8A3D", 0.1)})`,
                            border: "1px solid",
                            borderColor: alpha("#FF8A3D", 0.1),
                          }}
                        >
                          <Typography variant="subtitle1" gutterBottom>
                            Information Extraction
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            FLAN-T5-XL handles question answering and precise
                            information extraction from complex documents
                          </Typography>
                        </Card>

                        <Card
                          sx={{
                            p: 3,
                            background: `linear-gradient(135deg, ${alpha(
                              "#FF6B6B",
                              0.05
                            )}, ${alpha("#FF6B6B", 0.1)})`,
                            border: "1px solid",
                            borderColor: alpha("#FF6B6B", 0.1),
                          }}
                        >
                          <Typography variant="subtitle1" gutterBottom>
                            Document Summarization
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            BART-large-CNN processes and condenses long
                            documents into clear, actionable summaries while
                            preserving key information
                          </Typography>
                        </Card>

                        <Card
                          sx={{
                            p: 3,
                            background: `linear-gradient(135deg, ${alpha(
                              "#FFA07A",
                              0.05
                            )}, ${alpha("#FFA07A", 0.1)})`,
                            border: "1px solid",
                            borderColor: alpha("#FFA07A", 0.1),
                          }}
                        >
                          <Typography variant="subtitle1" gutterBottom>
                            Legal Understanding
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            LegalPro-BERT-base provides domain-specific analysis
                            of legal terminology and document structure
                          </Typography>
                        </Card>
                      </Stack>
                    </Grid>

                    {/* Right side visualization remains the same */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <Box sx={{ p: 4, position: "relative" }}>
                          {[
                            {
                              name: "BART-large-MNLI",
                              description: "Zero-shot document classification",
                              color: "#FF4B4B",
                            },
                            {
                              name: "FLAN-T5-XL",
                              description: "Information extraction & QA",
                              color: "#FF8A3D",
                            },
                            {
                              name: "BART-large-CNN",
                              description: "Document summarization",
                              color: "#FF6B6B",
                            },
                            {
                              name: "LegalPro-BERT-base",
                              description: "Legal document understanding",
                              color: "#FFA07A",
                            },
                          ].map((model, index) => (
                            <Box
                              key={model.name}
                              sx={{
                                p: 3,
                                mb: 2,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: alpha(model.color, 0.3),
                                backgroundColor: alpha(model.color, 0.1),
                                position: "relative",
                                "&::after":
                                  index < 3
                                    ? {
                                        content: '""',
                                        position: "absolute",
                                        left: "50%",
                                        bottom: "-16px",
                                        width: "2px",
                                        height: "16px",
                                        backgroundColor: model.color,
                                      }
                                    : {},
                              }}
                            >
                              <Typography variant="subtitle1" gutterBottom>
                                {model.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {model.description}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>

                {/* Core Technologies Section */}
                <Box sx={{ mb: 8 }}>
                  <Typography variant="h4" sx={{ mb: 4, color: "#61DAFB" }}>
                    Core Technologies
                  </Typography>
                  <Grid container spacing={4}>
                    {[
                      {
                        name: "React",
                        shortName: "R",
                        color: "#61DAFB",
                        description:
                          "Modern frontend framework for building dynamic user interfaces",
                        features: [
                          "Component-Based",
                          "Virtual DOM",
                          "React Router",
                          "Material-UI",
                        ],
                      },
                      {
                        name: "Node.js",
                        shortName: "N",
                        color: "#68A063",
                        description:
                          "Server-side JavaScript runtime environment powering our backend infrastructure",
                        features: [
                          "Express.js",
                          "REST API",
                          "WebSocket",
                          "JWT Auth",
                        ],
                      },
                      {
                        name: "MongoDB",
                        shortName: "M",
                        color: "#4DB33D",
                        description:
                          "NoSQL database for efficient data management and scalability",
                        features: [
                          "Mongoose ODM",
                          "CRUD Operations",
                          "Atlas Cloud",
                          "Real-time Updates",
                        ],
                      },
                      {
                        name: "Claude's API",
                        shortName: "C",
                        color: "#6B4FBB",
                        description:
                          "Advanced AI capabilities for intelligent document analysis",
                        features: [
                          "NLP Processing",
                          "Document Analysis",
                          "Risk Assessment",
                          "Smart Summaries",
                        ],
                      },
                    ].map((tech) => (
                      <Grid item xs={12} sm={6} md={3} key={tech.name}>
                        <TechStackCard>
                          <Box
                            sx={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "12px",
                              background: `linear-gradient(135deg, ${tech.color}30, ${tech.color}10)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 3,
                              mx: "auto",
                            }}
                          >
                            <Typography
                              sx={{
                                color: tech.color,
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                              }}
                            >
                              {tech.shortName}
                            </Typography>
                          </Box>
                          <Typography
                            variant="h6"
                            align="center"
                            gutterBottom
                            sx={{ color: theme.palette.text.primary }}
                          >
                            {tech.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            align="center"
                            sx={{ color: theme.palette.text.secondary, mb: 2 }}
                          >
                            {tech.description}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              justifyContent: "center",
                            }}
                          >
                            {tech.features.map((feature, index) => (
                              <Chip
                                key={index}
                                label={feature}
                                size="small"
                                sx={{
                                  background: `${tech.color}20`,
                                  color: tech.color,
                                  "&:hover": {
                                    background: `${tech.color}30`,
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </TechStackCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Additional Features Section */}
                <Box>
                  <Typography variant="h4" sx={{ mb: 4, color: "#4ECDC4" }}>
                    Additional Features
                  </Typography>
                  <Grid container spacing={4}>
                    {[
                      {
                        name: "Security",
                        shortName: "S",
                        color: "#FF6B6B",
                        description:
                          "Comprehensive security features to protect your data",
                        features: [
                          "bcryptjs",
                          "JWT",
                          "Secure Headers",
                          "CORS Protection",
                        ],
                      },
                      {
                        name: "Real-time",
                        shortName: "RT",
                        color: "#4ECDC4",
                        description: "Real-time communication and updates",
                        features: [
                          "Socket.io",
                          "Live Updates",
                          "WebSocket",
                          "Event Handling",
                        ],
                      },
                      {
                        name: "Document Processing",
                        shortName: "DP",
                        color: "#45B7D1",
                        description:
                          "Advanced document processing capabilities",
                        features: [
                          "PDF Parse",
                          "PDFKit",
                          "File Upload",
                          "Document Generation",
                        ],
                      },
                      {
                        name: "API Integration",
                        shortName: "API",
                        color: "#96C93D",
                        description:
                          "Robust API infrastructure and integrations",
                        features: [
                          "Axios",
                          "REST APIs",
                          "Error Handling",
                          "Rate Limiting",
                        ],
                      },
                    ].map((feature) => (
                      <Grid item xs={12} sm={6} md={3} key={feature.name}>
                        <TechStackCard>
                          <Box
                            sx={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "12px",
                              background: `linear-gradient(135deg, ${feature.color}30, ${feature.color}10)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 3,
                              mx: "auto",
                            }}
                          >
                            <Typography
                              sx={{
                                color: feature.color,
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                              }}
                            >
                              {feature.shortName}
                            </Typography>
                          </Box>
                          <Typography
                            variant="h6"
                            align="center"
                            gutterBottom
                            sx={{ color: theme.palette.text.primary }}
                          >
                            {feature.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            align="center"
                            sx={{ color: theme.palette.text.secondary, mb: 2 }}
                          >
                            {feature.description}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              justifyContent: "center",
                            }}
                          >
                            {feature.features.map((feat, index) => (
                              <Chip
                                key={index}
                                label={feat}
                                size="small"
                                sx={{
                                  background: `${feature.color}20`,
                                  color: feature.color,
                                  "&:hover": {
                                    background: `${feature.color}30`,
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </TechStackCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </StyledContainer>
          </PageSection>
          {/* Statistics Section */}
          <PageSection>
            <StyledContainer maxWidth="lg">
              <Grid container spacing={4}>
                {stats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 4,
                        background: theme.palette.background.paper,
                        borderRadius: "16px",
                        height: "100%",
                      }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          background:
                            "linear-gradient(45deg, #61DAFB, #6B4FBB)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          mb: 1,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {stat.label}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary }}>
                        {stat.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </StyledContainer>
          </PageSection>
          {/* Testimonials Section */}
          <PageSection>
            <StyledContainer maxWidth="lg">
              <Typography variant="h2" align="center" sx={{ mb: 6 }}>
                What Our Users Say
              </Typography>
              <Grid container spacing={4}>
                {testimonials.map((testimonial, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Box
                      sx={{
                        p: 4,
                        background: theme.palette.background.paper,
                        borderRadius: "16px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 3,
                          fontStyle: "italic",
                          color: theme.palette.text.primary,
                        }}
                      >
                        "{testimonial.quote}"
                      </Typography>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {testimonial.author}
                        </Typography>
                        <Typography
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {testimonial.role}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </StyledContainer>
          </PageSection>
          {/* CTA Section */}
          <PageSection>
            <StyledContainer maxWidth="md" sx={{ textAlign: "center" }}>
              <Typography variant="h2" gutterBottom>
                Ready to Simplify Legal Documents?
              </Typography>
              <Typography sx={{ mb: 6, color: theme.palette.text.secondary }}>
                Join us by using Wrap to understand your legal documents better.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <StyledButton
                  gradient="linear-gradient(45deg, #61DAFB 10%, #6B4FBB 90%)"
                  size="large"
                  onClick={() => navigate("/signup")}
                  sx={{ color: "white" }}
                >
                  Get Started Now
                </StyledButton>
                <StyledButton
                  component="a"
                  href="https://drive.google.com/file/d/1nridL8YNknQwpetn9mXtM3sKLg07z_k_/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="large"
                  startIcon={<DownloadIcon />}
                  sx={{
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider,
                    "&:hover": {
                      borderColor: theme.palette.text.primary,
                    },
                  }}
                >
                  Download Extension
                </StyledButton>
                <StyledButton
                  component="a"
                  href="https://chromewebstore.google.com/detail/wrap/pmaajlkakfpenkopkmhlepopeipgjpgn"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="large"
                  startIcon={<DownloadIcon />}
                  sx={{
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider,
                    "&:hover": {
                      borderColor: theme.palette.text.primary,
                    },
                  }}
                >
                  Add from Chrome Extension Store
                </StyledButton>
              </Box>
            </StyledContainer>
          </PageSection>
          {/* Footer */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.default,
              py: 4,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Container maxWidth="lg">
              <Typography
                variant="body2"
                align="center"
                sx={{ color: theme.palette.text.secondary }}
              >
                &copy; {new Date().getFullYear()} Wrap. All rights reserved.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  gap: 4,
                }}
              >
                <Button
                  color="inherit"
                  onClick={() => navigate("/privacy-policy")}
                  sx={{
                    textTransform: "none",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Privacy Policy
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/terms-of-service")}
                  sx={{
                    textTransform: "none",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Terms of Service
                </Button>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default LandingPage;
