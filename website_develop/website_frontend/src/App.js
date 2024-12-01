// // App.js
// import CssBaseline from "@mui/material/CssBaseline";
// import {
//   ThemeProvider as MuiThemeProvider,
//   createTheme,
// } from "@mui/material/styles";
// import React, { useContext } from "react";
// import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import { ThemeContext, ThemeProvider } from "./colorTheme/ThemeContext";
// import ProtectedRoute from "./Components/ProtectedRoute"; // Import the ProtectedRoute component
// import LogInPage from "./Pages/LogInPage";
// import PageNotFound from "./Pages/PageNoFound";
// import MainPage from "./Pages/Paperbase";
// import ProfilePage from "./Pages/ProfilePage";
// import HistoryPage from "./Pages/ReportLibrary";
// import ResetPassword from "./Pages/ResetPage";
// import SettingPage from "./Pages/SettingPage";
// import SignUpPage from "./Pages/SignUpPage";
// import VerificationCode from "./Pages/VerificationCodePage";
// import LandingPage from "./Pages/LandingPage";
// import PrivacyPolicy from "./Components/PrivacyPolicy.jsx";
// import TermsOfService from "../src/Components/TermsCondition.jsx";
// import TeamPage from "./Pages/TeamPage.js";
// import { Helmet } from 'react-helmet';
// function App() {
//   return (
//     <ThemeProvider>
//       <AppContent />
//     </ThemeProvider>
//   );
// }

// function AppContent() {
//   const { mode } = useContext(ThemeContext);

//   const fontSize = JSON.parse(localStorage.getItem("fontSize")) || 16;

//   const theme = React.useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode,
//           primary: {
//             light: "#63a4ff",
//             main: "rgb(178,178,178)",
//             dark: "#004ba0",
//             contrastText: "#2D3E4E",
//           },
//           secondary: {
//             light: "#63a4ff",
//             main: "rgb(178,178,178)",
//             dark: "#004ba0",
//             contrastText: "#2D3E4E",
//           },
//           background: {
//             default: mode === "light" ? "#F5F5F5" : "#121212",
//           },
//         },
//         typography: {
//           fontFamily: '"Quicksand", sans-serif',
//           h5: {
//             fontWeight: 400,
//             fontSize: "1.5rem",
//             letterSpacing: "0.0075em",
//           },
//           body1: {
//             fontSize: `${fontSize}px`,
//             fontWeight: 300,
//             lineHeight: 1.5,
//           },
//         },
//         shape: {
//           borderRadius: 8,
//         },
//         components: {
//           MuiTab: {
//             defaultProps: {
//               disableRipple: true,
//             },
//             styleOverrides: {
//               root: {
//                 textTransform: "none",
//                 margin: "0 16px",
//                 minWidth: 0,
//                 padding: 0,
//                 "&:hover": {
//                   color: "#4fc3f7",
//                 },
//               },
//             },
//           },
//           MuiDrawer: {
//             styleOverrides: {
//               paper: {
//                 backgroundColor: mode === "light" ? "#fff" : "#181B1B",
//               },
//             },
//           },
//           MuiButton: {
//             styleOverrides: {
//               root: {
//                 textTransform: "none",
//               },
//               contained: {
//                 boxShadow: "none",
//                 "&:active": {
//                   boxShadow: "none",
//                 },
//               },
//             },
//           },
//           MuiTabs: {
//             styleOverrides: {
//               root: {
//                 marginLeft: 8,
//               },
//               indicator: {
//                 height: 3,
//                 borderTopLeftRadius: 3,
//                 borderTopRightRadius: 3,
//                 backgroundColor: "#181B1B",
//               },
//             },
//           },
//           MuiIconButton: {
//             styleOverrides: {
//               root: {
//                 padding: 8,
//               },
//             },
//           },
//           MuiTooltip: {
//             styleOverrides: {
//               tooltip: {
//                 borderRadius: 4,
//               },
//             },
//           },
//           MuiDivider: {
//             styleOverrides: {
//               root: {
//                 backgroundColor: "#181B1B",
//               },
//             },
//           },
//           MuiListItemButton: {
//             styleOverrides: {
//               root: {
//                 "&.Mui-selected": {
//                   color: "#4fc3f7",
//                 },
//               },
//             },
//           },
//           MuiListItemText: {
//             styleOverrides: {
//               primary: {
//                 fontSize: 14,
//                 fontWeight: 500,
//               },
//             },
//           },
//           MuiListItemIcon: {
//             styleOverrides: {
//               root: {
//                 color: "inherit",
//                 minWidth: "auto",
//                 marginRight: 8,
//                 "& svg": {
//                   fontSize: 20,
//                 },
//               },
//             },
//           },
//           MuiAvatar: {
//             styleOverrides: {
//               root: {
//                 width: 32,
//                 height: 32,
//               },
//             },
//           },
//         },
//       }),
//     [mode, fontSize]
//   );

//   return (
//     <MuiThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <Routes>
//           {/* Public routes */}
//           <Route path="/login" element={<LogInPage />} />
//           <Route path="/signup" element={<SignUpPage />} />
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/pagenotfound" element={<PageNotFound />} />
//           <Route path="/resetpassword" element={<ResetPassword />} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/terms-of-service" element={<TermsOfService />} />
//           <Route path="/team" element={<TeamPage />} />

//           {/* Protected routes */}
//           <Route
//             path="/mainpage"
//             element={
//               <ProtectedRoute>
//                 <MainPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/settings"
//             element={
//               <ProtectedRoute>
//                 <SettingPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/history"
//             element={
//               <ProtectedRoute>
//                 <HistoryPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/verification-code" element={<VerificationCode />} />
//           {/* Add more routes as needed */}
//         </Routes>
//       </Router>
//     </MuiThemeProvider>
//   );
// }

// export default App;
import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import React, { useContext } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ThemeContext, ThemeProvider } from "./colorTheme/ThemeContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import LogInPage from "./Pages/LogInPage";
import PageNotFound from "./Pages/PageNoFound";
import MainPage from "./Pages/Paperbase";
import ProfilePage from "./Pages/ProfilePage";
import HistoryPage from "./Pages/ReportLibrary";
import ResetPassword from "./Pages/ResetPage";
import SettingPage from "./Pages/SettingPage";
import SignUpPage from "./Pages/SignUpPage";
import VerificationCode from "./Pages/VerificationCodePage";
import LandingPage from "./Pages/LandingPage";
import PrivacyPolicy from "./Components/PrivacyPolicy.jsx";
import TermsOfService from "../src/Components/TermsCondition.jsx";
import TeamPage from "./Pages/TeamPage.js";

// SEO 配置对象
const seoConfig = {
  home: {
    title: "WRAP - Legal Document Analysis System",
    description:
      "Web-based Resource for Analyzing Papers - A comprehensive legal document analysis system for legal documents and contracts",
    keywords:
      "legal document analysis, terms and conditions, privacy policy, contract analysis, NLP",
  },
  mainpage: {
    title: "WRAP - Document Analysis Dashboard",
    description:
      "Analyze and manage your legal documents with advanced NLP technology. Real-time analysis and insights.",
    keywords:
      "document analysis, legal documents, NLP, AI analysis, document management",
  },
  history: {
    title: "WRAP - Analysis History & Reports",
    description:
      "View and manage your document analysis history. Access past analyses and download reports.",
    keywords:
      "document history, analysis reports, legal documents, report management",
  },
  login: {
    title: "Login - WRAP Document Analysis System",
    description:
      "Sign in to access WRAP's legal document analysis tools and manage your documents",
    keywords: "login, sign in, document analysis, legal tech",
  },
  signup: {
    title: "Sign Up - WRAP Document Analysis System",
    description:
      "Create an account to start analyzing legal documents with advanced AI technology",
    keywords: "sign up, register, create account, legal analysis",
  },
  profile: {
    title: "User Profile - WRAP System",
    description: "Manage your WRAP account settings and preferences",
    keywords: "profile, account settings, user preferences",
  },
  settings: {
    title: "Settings - WRAP System",
    description: "Configure your WRAP system preferences and analysis settings",
    keywords: "settings, configuration, preferences, system settings",
  },
  privacy: {
    title: "Privacy Policy - WRAP",
    description: "Read about how WRAP protects and handles your data",
    keywords: "privacy policy, data protection, user privacy",
  },
  terms: {
    title: "Terms of Service - WRAP",
    description:
      "Understanding your rights and responsibilities when using WRAP",
    keywords: "terms of service, user agreement, legal terms",
  },
  team: {
    title: "Our Team - WRAP",
    description: "Meet the team behind WRAP's legal document analysis system",
    keywords: "team, about us, developers, leadership",
  },
  404: {
    title: "Page Not Found - WRAP",
    description: "The requested page could not be found on WRAP",
    keywords: "404, not found, error page",
  },
};

// SEO 包装组件
function SEOWrapper({ route, children }) {
  const seo = seoConfig[route] || seoConfig.home;
  const currentUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />

        {/* Open Graph tags */}
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content="/Wrap.png" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content="/Wrap.png" />

        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />
      </Helmet>
      {children}
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </HelmetProvider>
  );
}

function AppContent() {
  const { mode } = useContext(ThemeContext);
  const fontSize = JSON.parse(localStorage.getItem("fontSize")) || 16;

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            light: "#63a4ff",
            main: "rgb(178,178,178)",
            dark: "#004ba0",
            contrastText: "#2D3E4E",
          },
          secondary: {
            light: "#63a4ff",
            main: "rgb(178,178,178)",
            dark: "#004ba0",
            contrastText: "#2D3E4E",
          },
          background: {
            default: mode === "light" ? "#F5F5F5" : "#121212",
          },
        },
        typography: {
          fontFamily: '"Quicksand", sans-serif',
          h5: {
            fontWeight: 400,
            fontSize: "1.5rem",
            letterSpacing: "0.0075em",
          },
          body1: {
            fontSize: `${fontSize}px`,
            fontWeight: 300,
            lineHeight: 1.5,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiTab: {
            defaultProps: {
              disableRipple: true,
            },
            styleOverrides: {
              root: {
                textTransform: "none",
                margin: "0 16px",
                minWidth: 0,
                padding: 0,
                "&:hover": {
                  color: "#4fc3f7",
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === "light" ? "#fff" : "#181B1B",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
              },
              contained: {
                boxShadow: "none",
                "&:active": {
                  boxShadow: "none",
                },
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              root: {
                marginLeft: 8,
              },
              indicator: {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                backgroundColor: "#181B1B",
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                padding: 8,
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                borderRadius: 4,
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                backgroundColor: "#181B1B",
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                "&.Mui-selected": {
                  color: "#4fc3f7",
                },
              },
            },
          },
          MuiListItemText: {
            styleOverrides: {
              primary: {
                fontSize: 14,
                fontWeight: 500,
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                color: "inherit",
                minWidth: "auto",
                marginRight: 8,
                "& svg": {
                  fontSize: 20,
                },
              },
            },
          },
          MuiAvatar: {
            styleOverrides: {
              root: {
                width: 32,
                height: 32,
              },
            },
          },
        },
      }),
    [mode, fontSize]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Helmet>
          <html lang="en" />
          <meta charSet="utf-8" />
          {/* 全局结构化数据 */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "WRAP",
              description:
                "Web-based Resource for Analyzing Papers - Legal Document Analysis System",
              applicationCategory: "Legal Document Analysis Tool",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "University of Utah WRAP Team",
                url: "https://wrapcapstone.com",
              },
            })}
          </script>
        </Helmet>

        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <SEOWrapper route="login">
                <LogInPage />
              </SEOWrapper>
            }
          />
          <Route
            path="/signup"
            element={
              <SEOWrapper route="signup">
                <SignUpPage />
              </SEOWrapper>
            }
          />
          <Route
            path="/"
            element={
              <SEOWrapper route="home">
                <LandingPage />
              </SEOWrapper>
            }
          />
          <Route
            path="/pagenotfound"
            element={
              <SEOWrapper route="404">
                <PageNotFound />
              </SEOWrapper>
            }
          />
          <Route
            path="/resetpassword"
            element={
              <SEOWrapper route="reset">
                <ResetPassword />
              </SEOWrapper>
            }
          />
          <Route
            path="/profile"
            element={
              <SEOWrapper route="profile">
                <ProfilePage />
              </SEOWrapper>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <SEOWrapper route="privacy">
                <PrivacyPolicy />
              </SEOWrapper>
            }
          />
          <Route
            path="/terms-of-service"
            element={
              <SEOWrapper route="terms">
                <TermsOfService />
              </SEOWrapper>
            }
          />
          <Route
            path="/team"
            element={
              <SEOWrapper route="team">
                <TeamPage />
              </SEOWrapper>
            }
          />

          {/* Protected routes */}
          <Route
            path="/mainpage"
            element={
              <ProtectedRoute>
                <SEOWrapper route="mainpage">
                  <MainPage />
                </SEOWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SEOWrapper route="settings">
                  <SettingPage />
                </SEOWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <SEOWrapper route="history">
                  <HistoryPage />
                </SEOWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification-code"
            element={
              <SEOWrapper route="verification">
                <VerificationCode />
              </SEOWrapper>
            }
          />
          {/* Add this catch-all route at the end */}
          <Route
            path="*"
            element={
              <SEOWrapper route="404">
                <PageNotFound />
              </SEOWrapper>
            }
          />
        </Routes>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
