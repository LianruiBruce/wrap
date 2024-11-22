import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function VerificationCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const email = user.email;
  const name = `${user.firstName} ${user.lastName}`;

  const [token, setToken] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds

  // Send Verification Code
  const sendVerificationCode = async () => {
    try {
      const response = await axios.post("/api/verification-code", {
        email,
        name,
      });
      setToken(response.data.token);
    } catch (error) {
      console.error(
        "Error sending verification code:",
        error.response?.data || error.message
      );
      setErrorMessage("Failed to send verification code. Please try again.");
    }
  };

  useEffect(() => {
    sendVerificationCode(); // Automatically send code on page load
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setResendDisabled(false); // Enable resend button
    }
  }, [timer]);

  const handleVerify = async () => {
    try {
      const response = await axios.post("/api/verify-code", {
        token,
        enteredCode,
      });
      if (response.status === 200) {
        axios
          .post("/api/signup", user)
          .then((response) => {
            console.log(response.data);
            navigate("/login"); // Redirect to login on success
          })
          .catch((error) => {
            console.error("Signup error", error);
            window.alert(
              error.response?.data.message || "Signup failed. Please try again."
            );
            navigate("/signup");
          });
      }
    } catch (error) {
      console.error(
        "Verification error:",
        error.response?.data || error.message
      );
      setErrorMessage(
        error.response?.data.message || "Verification failed. Please try again."
      );
    }
  };

  const handleResend = () => {
    setTimer(300); // Reset timer to 5 minutes
    setResendDisabled(true);
    sendVerificationCode();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Verification Code
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  required
                  fullWidth
                  id="verificationCode"
                  label="Enter Verification Code"
                  name="verificationCode"
                  onChange={(e) => setEnteredCode(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  onClick={handleResend}
                  fullWidth
                  variant="contained"
                  disabled={resendDisabled}
                >
                  {resendDisabled
                    ? `Wait ${Math.floor(timer / 60)}:${String(
                        timer % 60
                      ).padStart(2, "0")}`
                    : "Resend"}
                </Button>
              </Grid>
            </Grid>
            {/* Error Message */}
            {errorMessage && (
              <Typography color="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
            {/* Submit Button */}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              onClick={handleVerify}
            >
              Submit
            </Button>
          </Box>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signup" variant="body2">
                Back to Sign Up
              </Link>
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
