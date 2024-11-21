import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Grid,
  Alert,
  Link,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const defaultTheme = createTheme();

export default function ResetPassword() {
  // State variables
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(""); // For email code verification
  const [token, setToken] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [step, setStep] = useState(1); // Steps in the reset process
  const [method, setMethod] = useState("email"); // 'email' or 'securityQuestion'
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  // Function to handle email submission and method switching
  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (method === "email") {
      // Send reset code to the user's email
      axios
        .post("/api/verification-code", { email })
        .then((response) => {
          setStatus({
            type: "success",
            message: "Reset code sent to your email.",
          });
          setToken(response.data.token);
          setStep(2);
        })
        .catch((error) => {
          setStatus({
            type: "error",
            message:
              error.response?.data?.message || "Failed to send reset code.",
          });
        });
    } else if (method === "securityQuestion") {
      // Fetch security question for the user
      axios
        .post("/api/get-security-question", { email })
        .then((response) => {
          const question = response.data.securityQuestion;
          if (question) {
            setSecurityQuestion(question);
            setStep(2);
          } else {
            setStatus({
              type: "error",
              message: "No security question found for this email.",
            });
          }
        })
        .catch((error) => {
          setStatus({
            type: "error",
            message:
              error.response?.data?.message ||
              "Failed to retrieve security question.",
          });
        });
    }
  };

  // Function to handle password reset submission
  const handleResetSubmit = (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (method === "email") {
      // Verify code and reset password
      axios
        .post("/api/reset-password-with-code", {
          email,
          code,
          token,
          newPassword,
        })
        .then((response) => {
          setStatus({
            type: "success",
            message: "Password reset successful. You can now sign in.",
          });
          setStep(3);
        })
        .catch((error) => {
          setStatus({
            type: "error",
            message:
              error.response?.data?.message ||
              "Failed to reset password. Please try again.",
          });
        });
    } else if (method === "securityQuestion") {
      // Verify security answer and reset password
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
          setStatus({
            type: "error",
            message:
              error.response?.data?.message ||
              "Failed to reset password. Please try again.",
          });
        });
    }
  };

  // Function to handle resending the code
  const handleResendCode = () => {
    setStatus({ type: "", message: "" });
    setIsResendDisabled(true); // Disable the button temporarily

    axios
      .post("/api/verification-code", { email })
      .then((response) => {
        setStatus({
          type: "success",
          message: "A new reset code has been sent to your email.",
        });
        setToken(response.data.token); // Update token if necessary

        // Re-enable the button after a delay (e.g., 60 seconds)
        setTimeout(() => setIsResendDisabled(false), 60000);
      })
      .catch((error) => {
        setStatus({
          type: "error",
          message:
            error.response?.data?.message || "Failed to resend reset code.",
        });
        setIsResendDisabled(false); // Re-enable on error
      });
  };

  // Function to render the security question text
  const renderSecurityQuestion = () => {
    const questionsMap = {
      mother_last_name: "What is your mother's last name?",
      born_city_name: "What is the name of your birth city?",
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
          {/* Header */}
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>

          {/* Status Message */}
          {status.message && (
            <Alert severity={status.type} sx={{ mt: 2 }}>
              {status.message}
            </Alert>
          )}

          {/* Step 1: Enter Email */}
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

              {/* Conditional Button Text */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {method === "email" ? "Send Code" : "Next"}
              </Button>

              {/* Method Switch Links */}
              {method === "email" ? (
                <Button
                  fullWidth
                  variant="text"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    setMethod("securityQuestion");
                    setStep(1);
                    setStatus({ type: "", message: "" });
                  }}
                >
                  Can't receive code? Reset via security question
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="text"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    setMethod("email");
                    setStep(1);
                    setStatus({ type: "", message: "" });
                  }}
                >
                  Prefer to reset via email code?
                </Button>
              )}
            </Box>
          )}

          {/* Step 2: Enter Code or Security Answer and New Password */}
          {step === 2 && (
            <Box
              component="form"
              onSubmit={handleResetSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              {method === "email" ? (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Reset Code"
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
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

                  {/* Resend Code Button */}
                  <Button
                    fullWidth
                    variant="text"
                    sx={{ mt: 1 }}
                    onClick={handleResendCode}
                    disabled={isResendDisabled}
                  >
                    Resend Code
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Reset Password
              </Button>

              {/* Method Switch Links */}
              {method === "email" ? (
                <Button
                  fullWidth
                  variant="text"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    setMethod("securityQuestion");
                    setStep(1);
                    setStatus({ type: "", message: "" });
                    setCode("");
                    setNewPassword("");
                  }}
                >
                  Can't receive code? Reset via security question
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="text"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    setMethod("email");
                    setStep(1);
                    setStatus({ type: "", message: "" });
                    setSecurityAnswer("");
                    setNewPassword("");
                  }}
                >
                  Prefer to reset via email code?
                </Button>
              )}
            </Box>
          )}

          {/* Step 3: Success Message */}
          {step === 3 && (
            <>
              <Alert severity="success" sx={{ mt: 2 }}>
                {status.message}
              </Alert>
              <Button
                href="/login"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Back to Sign In
              </Button>
            </>
          )}

          {/* Back to Sign In Link */}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button href="/login" variant="body2">
                Back to Sign In
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
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
