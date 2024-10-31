import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const defaultTheme = createTheme();

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Security question

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    axios
      .post("/api/get-security-question", { email })
      .then((response) => {
        console.log("Security Question Response:", response.data);
        const question = response.data.securityQuestion;

        if (question) {
          setSecurityQuestion(question);
          setStep(2); // Proceed to step 2
        } else {
          setStatus({
            type: "error",
            message: "No security question found for this email.",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching security question:", error);
        setStatus({
          type: "error",
          message:
            error.response?.data?.message ||
            "Failed to retrieve security question.",
        });
      });
  };

  const handleResetSubmit = (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    axios
      .post("/api/reset-password", { email, securityAnswer, newPassword })
      .then((response) => {
        setStatus({
          type: "success",
          message: "Password reset successful. You can now sign in.",
        });
        setStep(3);
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
        setStatus({
          type: "error",
          message:
            error.response?.data?.message ||
            "Failed to reset password. Please try again.",
        });
      });
  };

  const renderSecurityQuestion = () => {
    const questionsMap = {
      mother_last_name: "What is your mother's last name?",
      born_city_name: "What is the name of your born city?",
      middle_school_name: "What was the name of your middle school?",
    };

    return questionsMap[securityQuestion] || "Security Question";
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          {status.message && (
            <Alert severity={status.type} sx={{ mt: 2 }}>
              {status.message}
            </Alert>
          )}

          {step === 1 && (
            <Box
              component="form"
              onSubmit={handleEmailSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Next
              </Button>
            </Box>
          )}

          {step === 2 && (
            <Box
              component="form"
              onSubmit={handleResetSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Typography variant="h6" sx={{ mt: 2 }}>
                {renderSecurityQuestion()}
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Security Answer"
                name="securityAnswer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="New Password"
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Reset Password
              </Button>
            </Box>
          )}

          {step === 3 && (
            <Button
              href="/login"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Back to Sign In
            </Button>
          )}

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button href="/login" variant="body2">
                Back to Sign In
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {"© "}
            <Link color="inherit" href="#">
              Wrap
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
