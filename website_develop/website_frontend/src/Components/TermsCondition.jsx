import React from "react";
import { Box, Container, Typography, Link, List, ListItem, ListItemText } from "@mui/material";

function TermsAndConditions() {
  return (
    <Box sx={{ bgcolor: "#f9f9f9", py: 5 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" sx={{ color: "#0056b3", mb: 2 }}>
            Terms and Conditions
          </Typography>
          <Typography variant="subtitle1">Last Updated: [Insert Date]</Typography>
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            p: 4,
          }}
        >
          {/* 1. Acceptance of Terms */}
          <Typography variant="h5" sx={{ color: "#0056b3", mb: 2 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography paragraph>
            By accessing or using the services provided by Wrap ("we," "us," or "our"), you agree to be
            bound by these Terms and Conditions ("Terms"). If you do not agree to all the terms and
            conditions, please do not use our services.
          </Typography>

          {/* 2. Description of Service */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            2. Description of Service
          </Typography>
          <Typography paragraph>
            Wrap is a project developed by students from the University of Utah. Our service utilizes
            Artificial Intelligence (AI) and Natural Language Processing (NLP) technologies to summarize
            legal documents. The summaries are intended to assist users in understanding complex legal
            materials but are not a substitute for professional legal advice.
          </Typography>

          {/* 3. No Legal Advice */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            3. No Legal Advice
          </Typography>
          <Typography paragraph>
            The content provided by our service is for informational purposes only and does not constitute
            legal advice. You should not rely on the summaries as a replacement for professional legal
            counsel. Always consult with a qualified attorney for legal matters.
          </Typography>

          {/* 4. Accuracy and Limitations */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            4. Accuracy and Limitations
          </Typography>
          <Typography paragraph>
            While we strive for accuracy, the AI and NLP technologies used may not capture all details or
            nuances of the original documents. Summaries may contain errors, omissions, or
            misinterpretations. We do not guarantee the completeness or correctness of the content
            provided.
          </Typography>

          {/* 5. User Responsibilities */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            5. User Responsibilities
          </Typography>
          <Typography paragraph>
            You agree to use the service at your own risk. You are responsible for verifying the
            information provided against the original legal documents. You agree not to hold Wrap or its
            team members liable for any inaccuracies or errors in the summaries.
          </Typography>

          {/* 6. Intellectual Property Rights */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            6. Intellectual Property Rights
          </Typography>
          <Typography paragraph>
            All content, features, and functionality (including but not limited to text, graphics, logos,
            and images) are the exclusive property of Wrap and its licensors. Unauthorized use of any
            intellectual property is prohibited.
          </Typography>

          {/* 7. Privacy Policy */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            7. Privacy Policy
          </Typography>
          <Typography paragraph>
            Your use of our service is also subject to our{" "}
            <Link href="/privacy-policy" color="#0056b3" underline="hover">
              Privacy Policy
            </Link>
            , which explains how we collect, use, and protect your personal information.
          </Typography>

          {/* 8. Limitation of Liability */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            8. Limitation of Liability
          </Typography>
          <Typography paragraph>
            In no event shall Wrap, nor its directors, employees, partners, agents, suppliers, or
            affiliates, be liable for any indirect, incidental, special, consequential, or punitive
            damages arising out of your access or use of, or inability to access or use, the service.
          </Typography>

          {/* 9. Indemnification */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            9. Indemnification
          </Typography>
          <Typography paragraph>
            You agree to defend, indemnify, and hold harmless Wrap and its affiliates from and against any
            and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses
            arising from your use of the service or violation of these Terms.
          </Typography>

          {/* 10. Termination */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            10. Termination
          </Typography>
          <Typography paragraph>
            We may terminate or suspend your access immediately, without prior notice or liability, for
            any reason whatsoever, including without limitation if you breach the Terms.
          </Typography>

          {/* 11. Changes to Terms */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            11. Changes to Terms
          </Typography>
          <Typography paragraph>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
            Any changes will be effective immediately upon posting. It is your responsibility to review
            these Terms periodically.
          </Typography>

          {/* 12. Governing Law */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            12. Governing Law
          </Typography>
          <Typography paragraph>
            These Terms shall be governed and construed in accordance with the laws of the State of Utah,
            without regard to its conflict of law provisions.
          </Typography>

          {/* 13. Severability */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            13. Severability
          </Typography>
          <Typography paragraph>
            If any provision of these Terms is held to be invalid or unenforceable, the remaining
            provisions will remain in effect.
          </Typography>

          {/* 14. Entire Agreement */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            14. Entire Agreement
          </Typography>
          <Typography paragraph>
            These Terms constitute the entire agreement between us regarding our service and supersede and
            replace any prior agreements we might have had.
          </Typography>

          {/* 15. Waiver */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            15. Waiver
          </Typography>
          <Typography paragraph>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver
            of those rights.
          </Typography>

          {/* 16. Contact Information */}
          <Typography variant="h5" sx={{ color: "#0056b3", mt: 4, mb: 2 }}>
            16. Contact Information
          </Typography>
          <Typography paragraph>
            If you have any questions about these Terms, please contact us at [Insert Contact Information].
          </Typography>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            textAlign: "center",
            mt: 5,
            py: 2,
            bgcolor: "#0056b3",
            color: "#fff",
            borderRadius: "8px",
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

export default TermsAndConditions;
