import React from "react";
import { Box, Container, Typography } from "@mui/material";

function PrivacyPolicy() {
  return (
    <Box sx={{ bgcolor: "#f9f9f9", py: 5 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" sx={{ color: "#0056b3", mb: 2 }}>
            Privacy Policy
          </Typography>
          <Typography variant="subtitle1">Effective Date: November 20th, 2024</Typography>
        </Box>

        {/* Section */}
        <Box
          sx={{
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            p: 4,
          }}
        >
          {/* Welcome Section */}
          <Typography variant="h5" sx={{ color: "#0056b3", mb: 2 }}>
            Welcome to Wrap
          </Typography>
          <Typography paragraph>
            Wrap is a capstone project created by students from the University of Utah. 
            This Privacy Policy explains how we collect, use, and protect your information.
          </Typography>

          {/* Information We Collect */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            Information We Collect
          </Typography>
          <Typography paragraph>We collect the following types of information:</Typography>
          <ul>
            <li>
              <strong>Personally Identifiable Information (PII):</strong> Your name and email address, which you provide during account creation.
            </li>
            <li>
              <strong>Website Content:</strong> We collect content from the websites you upload or input for processing text.
            </li>
          </ul>

          {/* How We Use Your Information */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            How We Use Your Information
          </Typography>
          <Typography paragraph>We use the collected information for the following purposes:</Typography>
          <ul>
            <li>To provide our core functionality of extracting text from websites.</li>
            <li>To communicate with you regarding updates, support, or any issues with your account.</li>
            <li>To ensure the security of your account through hashed passwords and hashed security answers.</li>
          </ul>

          {/* Security of Your Data */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            Security of Your Data
          </Typography>
          <Typography paragraph>We take your data security seriously and implement the following measures:</Typography>
          <ul>
            <li>All communication between you and our servers is encrypted using HTTPS.</li>
            <li>Your passwords and security answers are securely hashed using bcrypt to protect against unauthorized access.</li>
            <li>We store your data in a secure MongoDB database with controlled access.</li>
          </ul>

          {/* Third-Party Sharing */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            Third-Party Sharing
          </Typography>
          <Typography paragraph>
            We do not sell, trade, or rent your personal information to third parties. 
            However, we may share information to comply with legal requirements or protect our rights.
          </Typography>

          {/* Your Choices */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            Your Choices
          </Typography>
          <Typography paragraph>You have control over your data:</Typography>
          <ul>
            <li>
              <strong>Access and Correction:</strong> You can access and update your information by logging into your account.
            </li>
            <li>
              <strong>Account Deletion:</strong> Contact us to delete your account and associated data permanently.
            </li>
          </ul>

          {/* Updates to This Policy */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            Updates to This Policy
          </Typography>
          <Typography paragraph>
            This Privacy Policy may be updated from time to time. Any changes will be posted on this page with an updated effective date.
          </Typography>

          {/* Contact Us */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about this Privacy Policy, please contact us:
          </Typography>
          <ul>
            <li>
              <strong>Email:</strong> wrapcapstone01@gmail.com
            </li>
            <li>
              <strong>Address:</strong> Kahlert School of Computing, University of Utah
            </li>
          </ul>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            textAlign: "center",
            mt: 5,
            py: 2,
            bgcolor: "#0056b3",
            color: "#fff",
          }}
        >
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Wrap. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default PrivacyPolicy;
