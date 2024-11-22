import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function SignUp() {
  const [signupStatus, setSignupStatus] = useState({ status: "idle" });
  const [errors, setErrors] = useState({});
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /\d/.test(password);
  };

  const validateForm = (user) => {
    let formErrors = {};

    if (!user.firstName) {
      formErrors.firstName = "First name is required";
    }
    if (!user.lastName) {
      formErrors.lastName = "Last name is required";
    }
    if (!user.email) {
      formErrors.email = "Email is required";
    } else if (!validateEmail(user.email)) {
      formErrors.email = "Invalid email format";
    }
    if (!user.password) {
      formErrors.password = "Password is required";
    } else if (!validatePassword(user.password)) {
      formErrors.password =
        "Password must be at least 8 characters and contain at least one number";
    }
    if (!user.securityQuestion) {
      formErrors.securityQuestion = "Security question is required";
    }
    if (!user.securityAnswer) {
      formErrors.securityAnswer = "Security answer is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSignupStatus({ status: "pending" });
    const data = new FormData(event.currentTarget);
    const user = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
      securityQuestion: data.get("securityQuestion"),
      securityAnswer: data.get("securityAnswer"),
    };

    if (validateForm(user)) {
      navigate("/verification-code", {
        state: {
          // email: user.email,
          // name: `${user.firstName} ${user.lastName}`
          user: user,
        },
      });
      // axios
      //   .post("/api/signup", user)
      //   .then((response) => {
      //     console.log(response.data);
      //     setSignupStatus({
      //       status: "success",
      //       message: "You have successfully signed up!",
      //     });

      //     navigate("/verification-code", {
      //       state: {
      //         // email: user.email,
      //         // name: `${user.firstName} ${user.lastName}`
      //         user: user
      //       }
      //     });

      //   })
      //   .catch((error) => {
      //     console.error("Signup error", error);
      //     setSignupStatus({
      //       status: "error",
      //       message:
      //         error.response?.data?.message ||
      //         "Signup failed. Please try again.",
      //     });
      //   });
    } else {
      setSignupStatus({
        status: "error",
        message: "Please correct the errors above.",
      });
    }
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
            Sign up
          </Typography>
          {signupStatus.status !== "idle" && (
            <Alert
              severity={signupStatus.status === "success" ? "success" : "error"}
              sx={{ mt: 2 }}
            >
              {signupStatus.message}
            </Alert>
          )}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              {/* First Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              {/* Last Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
              {/* Security Question */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  select
                  name="securityQuestion"
                  id="securityQuestion"
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                  error={!!errors.securityQuestion}
                  helperText={
                    errors.securityQuestion ||
                    "Please select a security question"
                  }
                >
                  <option value="" disabled>
                    Select a question
                  </option>
                  <option value="mother_last_name">
                    What is your mother's last name?
                  </option>
                  <option value="born_city_name">
                    What is the name of your born city?
                  </option>
                  <option value="middle_school_name">
                    What was the name of your middle school?
                  </option>
                </TextField>
              </Grid>
              {/* Security Answer */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="securityAnswer"
                  label="Security Answer"
                  type="text"
                  id="securityAnswer"
                  autoComplete="security-answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  error={!!errors.securityAnswer}
                  helperText={
                    errors.securityAnswer ||
                    "Answer to your security question, please keep this in mind. This is the only way to reset password right now."
                  }
                />
              </Grid>
            </Grid>
            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={signupStatus.status === "pending"}
            >
              {signupStatus.status === "pending" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>
            {/* Sign In Link */}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* Footer */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {"© "}
            <Link color="inherit" href="/privacy-policy">
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
