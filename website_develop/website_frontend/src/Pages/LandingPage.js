import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  Box,
  Chip,
  Link,
} from "@mui/material";
import { styled } from "@mui/system";

// Import all required icons
import ExtensionIcon from "@mui/icons-material/Extension";
import DescriptionIcon from "@mui/icons-material/Description";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SecurityIcon from "@mui/icons-material/Security";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShieldIcon from "@mui/icons-material/Shield";
import SavingsIcon from "@mui/icons-material/Savings";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

// Styled Components
const StyledButton = styled(Button)(({ theme, gradient }) => ({
  borderRadius: "8px",
  padding: "12px 24px",
  textTransform: "none",
  fontSize: "1rem",
  background: gradient || "transparent",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  },
}));

const FeatureCard = styled(Card)({
  background: "rgba(18, 18, 23, 0.8)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  padding: "24px",
  height: "100%",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-8px)",
    "& .card-glow": {
      opacity: 1,
    },
  },
});

const TechStackCard = styled(Card)({
  background: "rgba(18, 18, 23, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  height: "100%",
  padding: "24px",
  transition: "all 0.3s ease",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  "&:hover": {
    transform: "translateY(-8px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
  },
});

const StyledContainer = styled(Container)({
  position: "relative",
  zIndex: 1,
});

const GradientText = styled(Typography)({
  background: "linear-gradient(45deg, #61DAFB 10%, #6B4FBB 50%, #68A063 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 0 40px rgba(97, 218, 251, 0.3)",
});

const PageSection = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 0",
  position: "relative",
});

function LandingPage() {
  const navigate = useNavigate();

  // Data arrays remain the same
  const techStack = [
    // Frontend Technologies
    {
      name: "React",
      shortName: "R",
      category: "Frontend",
      color: "#61DAFB",
      description:
        "Modern frontend framework for building dynamic user interfaces.",
      features: [
        "Component-Based",
        "Virtual DOM",
        "React Router",
        "Material-UI",
      ],
    },
    // Backend Technologies
    {
      name: "Node.js",
      shortName: "N",
      category: "Backend",
      color: "#68A063",
      description:
        "Server-side JavaScript runtime environment powering our backend infrastructure.",
      features: ["Express.js", "REST API", "WebSocket", "JWT Auth"],
    },
    // Database
    {
      name: "MongoDB",
      shortName: "M",
      category: "Database",
      color: "#4DB33D",
      description:
        "NoSQL database for efficient data management and scalability.",
      features: [
        "Mongoose ODM",
        "CRUD Operations",
        "Atlas Cloud",
        "Real-time Updates",
      ],
    },
    // AI/ML
    {
      name: "Claude's API",
      shortName: "C",
      category: "AI",
      color: "#6B4FBB",
      description:
        "Advanced AI capabilities for intelligent document analysis.",
      features: [
        "NLP Processing",
        "Document Analysis",
        "Risk Assessment",
        "Smart Summaries",
      ],
    },
    // Additional Technologies
    {
      name: "Security",
      shortName: "S",
      category: "Security",
      color: "#FF6B6B",
      description: "Comprehensive security features to protect your data.",
      features: ["bcryptjs", "JWT", "Secure Headers", "CORS Protection"],
    },
    {
      name: "Real-time",
      shortName: "RT",
      category: "Features",
      color: "#4ECDC4",
      description: "Real-time communication and updates.",
      features: ["Socket.io", "Live Updates", "WebSocket", "Event Handling"],
    },
    {
      name: "Document Processing",
      shortName: "DP",
      category: "Features",
      color: "#45B7D1",
      description: "Advanced document processing capabilities.",
      features: ["PDF Parse", "PDFKit", "File Upload", "Document Generation"],
    },
    {
      name: "API Integration",
      shortName: "API",
      category: "Features",
      color: "#96C93D",
      description: "Robust API infrastructure and integrations.",
      features: ["Axios", "REST APIs", "Error Handling", "Rate Limiting"],
    },
  ];

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

  const detailedFeatures = [
    {
      title: "Smart Document Analysis",
      description:
        "Understand complex legal documents in seconds with our AI-powered analysis.",
      icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: "#61DAFB" }} />,
      gradient: "linear-gradient(135deg, #61DAFB20 0%, #2A5AFA20 100%)",
      details: [
        "Key terms extraction",
        "Obligation identification",
        "Risk assessment",
        "Summary generation",
      ],
    },
    {
      title: "Browser Integration",
      description:
        "Seamlessly analyze documents while browsing with our Chrome extension.",
      icon: <ExtensionIcon sx={{ fontSize: 40, color: "#4DB33D" }} />,
      gradient: "linear-gradient(135deg, #4DB33D20 0%, #2E7D3220 100%)",
      details: [
        "One-click analysis",
        "Works on any website",
        "Real-time processing",
        "Secure connection",
      ],
    },
    {
      title: "Comprehensive Reports",
      description:
        "Get detailed reports with actionable insights and risk assessments.",
      icon: <AssessmentIcon sx={{ fontSize: 40, color: "#6B4FBB" }} />,
      gradient: "linear-gradient(135deg, #6B4FBB20 0%, #4527A020 100%)",
      details: [
        "Clear summaries",
        "Risk highlights",
        "Action items",
        "Export options",
      ],
    },
    {
      title: "Security & Privacy",
      description:
        "Your documents are processed with enterprise-grade security and privacy.",
      icon: <SecurityIcon sx={{ fontSize: 40, color: "#FF6B6B" }} />,
      gradient: "linear-gradient(135deg, #FF6B6B20 0%, #CC4B4B20 100%)",
      details: [
        "Data privacy",
        "Secure processing",
        "No sensitive data storage",
      ],
    },
  ];

  const testimonials = [
    {
      quote:
        "Wrap has the ability to transform the way we review legal documents.",
      author: "Jiachen Ren",
      role: "3D Modeler",
      company: "Aureum Gale Games",
    },
    {
      quote: "The AI analysis saves us hours of document review time.",
      author: "Xuanhao Mei",
      role: "Technical Art Student",
      company: "University of Utah",
    },
    // {
    //   quote: "Simple yet powerful. Exactly what we needed.",
    //   author: "Emily Thompson",
    //   role: "Compliance Officer",
    //   company: "Finance Corp",
    // },
  ];

  // const benefits = [
  //   {
  //     title: "Time Saving",
  //     description:
  //       "Reduce document review time by up to 80% with AI-powered analysis",
  //     icon: <AccessTimeIcon sx={{ fontSize: 40, color: "#61DAFB" }} />,
  //   },
  //   {
  //     title: "Risk Mitigation",
  //     description:
  //       "Identify potential legal risks and obligations automatically",
  //     icon: <ShieldIcon sx={{ fontSize: 40, color: "#4DB33D" }} />,
  //   },
  //   {
  //     title: "Cost Effective",
  //     description:
  //       "Significantly reduce legal review costs with automated analysis",
  //     icon: <SavingsIcon sx={{ fontSize: 40, color: "#6B4FBB" }} />,
  //   },
  //   {
  //     title: "Easy Integration",
  //     description: "Seamlessly integrate with your existing workflow",
  //     icon: (
  //       <IntegrationInstructionsIcon sx={{ fontSize: 40, color: "#68A063" }} />
  //     ),
  //   },
  // ];

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
    <Box
      sx={{
        bgcolor: "#000000",
        color: "white",
        background: `
          radial-gradient(circle at 10% 20%, rgba(104, 160, 99, 0.15) 0%, transparent 20%),
          radial-gradient(circle at 90% 30%, rgba(97, 218, 251, 0.15) 0%, transparent 20%),
          radial-gradient(circle at 50% 50%, rgba(77, 179, 61, 0.15) 0%, transparent 20%),
          radial-gradient(circle at 20% 80%, rgba(107, 79, 187, 0.15) 0%, transparent 20%),
          #000000
        `,
      }}
    >
      {/* Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Wrap
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <StyledButton
              variant="text"
              onClick={() => navigate("/login")}
              sx={{ color: "white" }}
            >
              Login
            </StyledButton>
            <StyledButton
              variant="contained"
              onClick={() => navigate("/signup")}
              sx={{
                background: "linear-gradient(45deg, #61DAFB 10%, #6B4FBB 90%)",
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
                color: "rgba(255, 255, 255, 0.8)",
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              AI-powered legal document analysis that helps you understand terms
              and conditions in seconds
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
                href="https://www.youtube.com/watch?v=lXnljtYhXJ0"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                startIcon={<PlayArrowIcon />}
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    borderColor: "white",
                  },
                }}
              >
                View Demo
              </StyledButton>
              <StyledButton
                component="a"
                href="https://drive.google.com/file/d/1qKfThOw06QKqctrOcBA_m2JPOhW5RIup/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                startIcon={<DownloadIcon />}
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    borderColor: "white",
                  },
                }}
              >
                Download Extension
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
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              Transform complex legal documents into clear, actionable insights
              in four simple steps
            </Typography>

            <Grid container spacing={6}>
              {workflowSteps.map((step, index) => (
                <Grid item xs={12} md={6} lg={3} key={index}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.03)",
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
                        background: "linear-gradient(45deg, #61DAFB, #6B4FBB)",
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
                        color: "rgba(255, 255, 255, 0.7)",
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
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
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

        {/* Detailed Features Section */}
        <PageSection>
          <StyledContainer maxWidth="lg">
            <Typography variant="h2" align="center" sx={{ mb: 2 }}>
              Key Features
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 8,
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              Advanced features designed to make legal document analysis simple
              and efficient
            </Typography>

            <Grid container spacing={4}>
              {detailedFeatures.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <FeatureCard>
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        {feature.icon}
                        <Typography variant="h5" sx={{ color: "white" }}>
                          {feature.title}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          mb: 3,
                        }}
                      >
                        {feature.description}
                      </Typography>

                      <Grid container spacing={2}>
                        {feature.details.map((detail, idx) => (
                          <Grid item xs={6} key={idx}>
                            <Box
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
                                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                              >
                                {detail}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </StyledContainer>
        </PageSection>

        {/* Tech Stack Section */}
        <PageSection>
          <StyledContainer maxWidth="lg">
            <Typography variant="h2" align="center" sx={{ mb: 2 }}>
              Our Tech Stack
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 8,
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              Built with cutting-edge technologies to provide a secure,
              scalable, and efficient solution
            </Typography>

            <Box sx={{ mb: 8 }}>
              <Typography variant="h4" sx={{ mb: 4, color: "#61DAFB" }}>
                Core Technologies
              </Typography>
              <Grid container spacing={4}>
                {techStack.slice(0, 4).map((tech) => (
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
                        sx={{ color: "white" }}
                      >
                        {tech.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
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

            <Box>
              <Typography variant="h4" sx={{ mb: 4, color: "#4ECDC4" }}>
                Additional Features
              </Typography>
              <Grid container spacing={4}>
                {techStack.slice(4).map((tech) => (
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
                            fontSize: "1.2rem",
                          }}
                        >
                          {tech.shortName}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        sx={{ color: "white" }}
                      >
                        {tech.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
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
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "16px",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        background: "linear-gradient(45deg, #61DAFB, #6B4FBB)",
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
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
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
                      background: "rgba(255, 255, 255, 0.03)",
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
                        color: "rgba(255, 255, 255, 0.9)",
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
                      <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        {testimonial.role}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.5)" }}
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
            <Typography sx={{ mb: 6, color: "rgba(255, 255, 255, 0.7)" }}>
              Join thousands of users who are already using Wrap to understand
              their legal documents better.
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
                href="https://drive.google.com/file/d/1qKfThOw06QKqctrOcBA_m2JPOhW5RIup/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                startIcon={<DownloadIcon />}
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    borderColor: "white",
                  },
                }}
              >
                Download Extension
              </StyledButton>
            </Box>
          </StyledContainer>
        </PageSection>

        {/* Footer */}
        <Box
          sx={{
            backgroundColor: "#000000",
            py: 4,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="body2"
              align="center"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
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
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Privacy Policy
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/terms-of-service")}
                sx={{
                  textTransform: "none",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Terms of Service
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default LandingPage;
