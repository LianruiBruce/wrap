import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  Button,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/system";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useNavigate } from "react-router-dom";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// Import team images
import teamImage from "../Images/team/wrapNew.JPG";
import lianruiImage from "../Images/team/Lianrui.jpg";
import xinyangImage from "../Images/team/Xinyang.jpg";
import daniImage from "../Images/team/Dani.jpg";
import joeyImage from "../Images/team/Joey.jpg";

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

const TeamMemberCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: "16px",
  height: "100%",
  transition: "all 0.3s ease",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[4],
  },
}));

const ProfileImage = styled("img")({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  objectFit: "cover",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
});

function TeamPage({ themeMode, setThemeMode }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Lianrui Geng",
      role: "Full Stack Developer",
      bio: "Lianrui Geng is a senior Computer Science student at the University of Utah, minoring in Mathematics. He specializes in full-stack development, natural language processing (NLP), and artificial intelligence (AI). As part of his graduate project, Lianrui co-created WRAP, a web platform integrating optimized front-end and back-end functionalities, Chrome extensions, and NLP for legal document analysis. He has also worked on GPU-accelerated ray tracing for 3D graphics, combining efficiency with innovation. With research interests in NLP, machine learning, and cloud computing, Lianrui brings practical experience in deploying applications on AWS, web development, and responsive design. Outside academics, he participates in open-source projects. He has gained industry experience in game development, IT support, and web design, driven by a passion for leveraging AI to solve real-world problems.",
      email: "u1346008@utah.edu",
      github: "https://github.com/LianruiBruce",
      linkedin: "https://www.linkedin.com/in/lianrui-geng-01533a294",
      image: lianruiImage,
    },
    {
      name: "Xinyang Wang",
      role: "Full Stack Developer",
      bio: "Xinyang Wang is a senior at the University of Utah, pursuing a Bachelor of Science in Computer Science with an anticipated Business Minor. With expertise in web development, programming, and database technologies, she has gained professional experience as an Algorithm Engineer, Game Development Engineer, and Software Development Intern, working on projects involving large language models, game logic design, and web development. Notable projects include a MongoDB-backed web extension integrating NLP, a GPU screen-space ray tracing application for optimized rendering, and an educational chemical lab simulation app. Xinyang Wang is passionate about AI, game development, and scalable web technologies, with a strong focus on creating impactful, user-centric digital solutions.",
      email: "xinyangsally@gmail.com",
      github: "https://github.com/XinyangSally",
      linkedin: "https://www.linkedin.com/in/xinyangwangsally",
      image: xinyangImage,
    },
    {
      name: "Daniel Coimbra",
      role: "AI/NLP Engineer",
      bio: "Daniel is a senior computer science major at the University of Utah, actively contributing to the Theory in Practice and ULEEF research groups. His research interests revolve around AI, Robotics and Fintech, focusing on challenges in robotic motion planning, human-robot interaction (HRI), and market simulation platforms. A published researcher and award-winning scholar, he has presented his work at prestigious venues like WAFR and the University of Utah Undergraduate Research Symposium and gained industry experience developing algorithms and optimization solutions. Beyond academics, Daniel co-founded Wrap, bringing his entrepreneurial drive to push boundaries and create impactful solutions.",
      email: "daniel.coimbra@utah.edu",
      github: "https://github.com/DaniCoimbra",
      linkedin: "https://www.linkedin.com/in/danielcoimbras",
      image: daniImage,
    },
    {
      name: "Joey Cai",
      role: "Full Stack Developer",
      bio: "Joey Cai is a skilled Computer Science undergraduate from the University of Utah, passionate about using technology to solve real-world problems. He has worked on projects like a VR-neck exoskeleton to assist patients with mobility challenges and contributed to real-time email synchronization systems during his internship at Clarity AI. Driven by a love for innovation, Joey thrives on creating impactful solutions that bridge complex technologies and practical applications. His relentless curiosity drives him to tackle challenges with creativity and persistence, turning abstract ideas into tangible outcomes. Joey is dedicated to leveraging his technical expertise to make meaningful contributions that address everyday challenges and improve people’s lives.",
      email: "cqy1508460399@gmail.com",
      github: "https://github.com/Joeic",
      linkedin: "https://www.linkedin.com/in/qiaoyi-cai-33639a262",
      image: joeyImage,
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
        background:
          theme.palette.mode === "light"
            ? `
          radial-gradient(circle at 15% 20%, rgba(97, 218, 251, 0.3) 0%, transparent 25%),
          radial-gradient(circle at 85% 25%, rgba(107, 79, 187, 0.3) 0%, transparent 25%),
          radial-gradient(circle at 75% 80%, rgba(255, 128, 128, 0.2) 0%, transparent 25%),
          radial-gradient(circle at 25% 75%, rgba(64, 192, 87, 0.2) 0%, transparent 25%),
          linear-gradient(180deg, rgba(97, 218, 251, 0.05) 0%, rgba(107, 79, 187, 0.05) 100%),
          #f9fafb
        `
            : `
          radial-gradient(circle at 15% 20%, rgba(97, 218, 251, 0.15) 0%, transparent 35%),
          radial-gradient(circle at 85% 25%, rgba(107, 79, 187, 0.15) 0%, transparent 35%),
          radial-gradient(circle at 75% 80%, rgba(255, 128, 128, 0.1) 0%, transparent 35%),
          radial-gradient(circle at 25% 75%, rgba(64, 192, 87, 0.1) 0%, transparent 35%),
          linear-gradient(180deg, rgba(97, 218, 251, 0.05) 0%, rgba(107, 79, 187, 0.05) 100%),
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
          <Button
            onClick={() => navigate("/")}
            sx={{
              textTransform: "none",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: theme.palette.text.primary,
              cursor: "pointer",
              "&:hover": {
                color: "#61DAFB",
              },
            }}
          >
            Wrap
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", gap: 2 }}>
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
                background: "linear-gradient(45deg, #61DAFB 10%, #6B4FBB 90%)",
                color: "white",
              }}
            >
              Sign Up
            </StyledButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ pt: 8 }}>
        {/* Hero Section */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #61DAFB 0%, #6B4FBB 50%, #FF8080 100%)",
            py: 10,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              align="center"
              sx={{ color: "white", mb: 3 }}
            >
              Meet Our Team
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{ color: "white", maxWidth: "800px", mx: "auto" }}
            >
              We're a passionate group of developers dedicated to making legal
              documents more accessible and understandable through innovative
              technology.
            </Typography>
          </Container>
        </Box>

        {/* Team Content */}
        <Container maxWidth="lg" sx={{ my: 8 }}>
          {/* Team Photo */}
          <Card
            sx={{
              mb: 8,
              overflow: "hidden",
              borderRadius: 4,
              boxShadow: theme.shadows[4],
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 400,
                overflow: "hidden",
              }}
            >
              <img
                src={teamImage}
                alt="Wrap Team"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Card>

          {/* Team Members Grid */}
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} md={6} key={index}>
                <TeamMemberCard>
                  <Box sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "200px", sm: "150px" },
                          height: { xs: "200px", sm: "150px" },
                          flexShrink: 0,
                        }}
                      >
                        <ProfileImage
                          src={member.image}
                          alt={member.name}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" gutterBottom>
                          {member.name}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: "#61DAFB", mb: 2 }}
                        >
                          {member.role}
                        </Typography>
                        <Typography
                          sx={{ color: theme.palette.text.secondary, mb: 3 }}
                        >
                          {member.bio}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                          <Button
                            variant="outlined"
                            startIcon={<EmailIcon />}
                            href={`mailto:${member.email}`}
                            size="small"
                          >
                            Email
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<GitHubIcon />}
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                          >
                            GitHub
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<LinkedInIcon />}
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                          >
                            LinkedIn
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </TeamMemberCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default TeamPage;
