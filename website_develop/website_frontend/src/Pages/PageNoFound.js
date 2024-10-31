import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ textAlign: "center", pt: 8 }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary" component="p">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Go to the Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default PageNotFound;
