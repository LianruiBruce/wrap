import React from "react";
import { CssBaseline, Box, Typography, Container, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Wrap
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function StickyFooter() {
  const theme = useTheme();

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Main content can be added here if needed */}

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: "auto",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body1">
              This is the footer here for the testing.
            </Typography>
            <Copyright />
          </Container>
        </Box>
      </Box>
    </>
  );
}
