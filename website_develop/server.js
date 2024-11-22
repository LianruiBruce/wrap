require("./dbModels/mongoConnection");
require("dotenv").config();
const User = require("./dbModels/user");
const Document = require("./dbModels/document");
const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const pdf = require("pdf-parse");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const multer = require("multer");
const crypto = require("crypto");

const {
  addDocument,
  isContainDocument,
  addUser,
  addUserDocument,
  fetchUserDocuments,
  pullUpDocandRepByDocID,
  deleteUserDocument,
} = require("./dbModels/DAO.js");

const {
  processData,
  convertPdfToText,
  generateReport,
  generateSections,
  generateReportByPDF,
  downloadPDF,
  getUserLatestDocument,
  fetchNumOfUserDoc,
  fetchFlag,
  toggleFlag,
  fetchFlagNum,
  fetchUserInfo,
} = require("./Controller.js");

app.use(express.json({ limit: "25mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ extended: true, limit: "25mb" })); // For URL-encoded bodies

// Define the port to run the server on
const port = process.env.PORT || 3000; // Using port 3001 to avoid conflict with React's default port 3000
const upload = multer();

// Middleware setup
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "./website_frontend/build")));

// Example API endpoint for fetching data
app.get("/api/data", (req, res) => {
  // Placeholder: Fetch data from your database or other source
  const exampleData = {
    message: "This is a sample response from your API",
  };
  res.json(exampleData);
});

// Serve the React application on all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./website_frontend/build/index.html"));
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

io.on("connection", (socket) => {
  console.log("A client connected");

  // Extract token from query parameters
  const token = socket.handshake.query.token;

  // Verify the token and extract the userId
  if (!token) {
    console.log("No token provided");
    socket.disconnect(); // Disconnect if no token is provided
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log("Token verification failed", err);
      socket.disconnect();
      return;
    }

    const userID = decoded.userId;

    fetchUserDocuments(userID).then((documents) => {
      console.log("this is send from io connection");
      socket.emit("reportList", documents); // Emitting with 'reportList'
    });
    // Fetch and send the user's documents
    try {
      const documents = await fetchUserDocuments(userID);
      console.log("This is sent from io connection");
      socket.emit("reportList", documents); // Emitting with 'reportList'
    } catch (error) {
      console.error("Error fetching user documents:", error);
    }

    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });
});

const jwt = require("jsonwebtoken");

const BREVO_API_KEY = process.env.BREVO_API_KEY;

app.post("/getLatestReportAfterDelete", authenticateToken, async (req, res) => {
  try {
    console.log(
      "Server received request from content js for getLatestReportAfterDelete"
    );

    const userID = req.user.userId;

    const latestDocumentID = await getUserLatestDocument(userID);
    const updatedContent = await pullUpDocandRepByDocID(latestDocumentID);

    if (updatedContent) {
      console.log(
        "Server is sending the latest document to content.js after delete:",
        JSON.stringify(updatedContent)
      );
      res.json({ success: true, information: updatedContent });
    } else {
      console.log("No latest document found for the user.");
      res.json({ success: false, message: "No latest document found" });
    }
  } catch (error) {
    console.error("Error fetching the latest document ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

app.post("/getFlagOfDoc", authenticateToken, async (req, res) => {
  try {
    const userID = req.user.userId;
    const { docID } = req.body;

    // Fetch the flag from the database using userID and docID
    const flag = await fetchFlag(userID, docID);

    // Return the flag value to the client
    res.status(200).json({ success: true, flag });
  } catch (error) {
    console.error("Error fetching flag:", error);
    res.status(500).json({ success: false, message: "Error fetching flag" });
  }
});

app.post("/getUserInfo", authenticateToken, async (req, res) => {
  try {
    const userID = req.user.userId;
    const userInfo = await fetchUserInfo(userID);
    res.status(200).json({ userInfo });
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ success: false, message: "Error fetching flag" });
  }
});

app.post("/toggleFlagOfDoc", authenticateToken, async (req, res) => {
  try {
    const userID = req.user.userId;
    const { docID } = req.body;

    await toggleFlag(userID, docID);

    res
      .status(200)
      .json({ success: true, message: "Flag toggled successfully" });
  } catch (error) {
    console.error("Error toggling flag of document:", error);
    res.status(500).json({ success: false, message: "Failed to toggle flag" });
  }
});

app.post("/num-flags", authenticateToken, async (req, res) => {
  try {
    console.log("Received request for /num-flags");
    const userID = req.user.userId;
    const flagNum = await fetchFlagNum(userID);
    res.status(200).json({ flagNum });
  } catch (error) {
    console.error("Error fetching number of flagged documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/getNumOfUserDoc", authenticateToken, async (req, res) => {
  console.log("Received request for /getNumOfUserDoc");
  try {
    const userID = req.user.userId;
    console.log("user is requesting number of  document :", userID);
    const numOfUserDoc = await fetchNumOfUserDoc(userID);

    if (numOfUserDoc !== undefined && numOfUserDoc !== null) {
      console.log("Fetched number of documents:", numOfUserDoc);
      return res.status(200).json({ numOfUserDoc });
    } else {
      console.error("Number of user documents not found");
      return res
        .status(404)
        .json({ message: "Number of user documents not found" });
    }
  } catch (error) {
    console.error("Error fetching number of user documents:", error);
    return res
      .status(500)
      .json({ message: "Error fetching number of user documents" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    console.log("Received login request:", { email, rememberMe });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User authenticated:", user._id);

    const expiresIn = rememberMe ? "30d" : "1d";
    console.log("Generating token with expiresIn:", expiresIn);

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: expiresIn }
    );

    console.log("Token generated:", token);

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Server error during login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/user-documents", authenticateToken, async (req, res) => {
  console.log("Received request for /user-documents");
  try {
    const userID = req.user.userId;
    const documents = await fetchUserDocuments(userID);
    console.log("this is sent from io post user-documents:", documents);
    res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching user documents:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching documents" });
  }
});

app.post("/delete-doc", authenticateToken, async (req, res) => {
  const { documentID } = req.body;
  const userID = req.user.userId;

  console.log("Received request for /delete-doc with documentID:", documentID);
  console.log("Received request for /delete-doc with userID:", userID);
  try {
    await deleteUserDocument(userID, documentID);
    const afterDelete = await fetchUserDocuments(userID);

    io.emit("documentDeleted", { documentID });

    //update left side bar in navigator
    io.emit("reportList", afterDelete);
    res
      .status(200)
      .json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error("Failed to delete document:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete document",
      error: error.message,
    });
  }
});

// receive url from extension background.js and handles
app.post("/process-webpage", async (req, res) => {
  const { text, textTags, url, title, headers, footer } = req.body;

  console.log("Received request for /process-webpage");

  try {
    const processedData = await processData({
      text,
      url,
      title,
      headers,
      footer,
    });
    if (!processedData.success) {
      return res.status(400).json(processedData);
    }

    console.log("textTags is: " + textTags);

    res.json({ success: true, data: processedData });
  } catch (error) {
    console.error("Failed to process URL:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process URL",
      error: error.message,
    });
  }
});

// generate report, receives a req with 4 fields: url, title, headers and footer
app.post("/generate-report", authenticateToken, async (req, res) => {
  const userID = req.user.userId;

  if (!userID) {
    console.error("Failed to generate report:", error);
    res.status(401).json({
      success: false,
      message: "Please Login Before Generate Report",
      error: error.message,
    });
    return;
  }

  const {
    text: text,
    sections: sections,
    company: company,
    date: date,
    category: category,
    readability: readability,
    textTags: textTags,
    saveToDatabase: saveToDatabase,
  } = req.body;

  console.log("Received request for /generate-report");

  try {
    const header = company + " - " + category + " - " + date;

    var document = await isContainDocument(company, date, category);

    if (document) {
      const report = document.get("reportFile");
      const section_summary = JSON.stringify(document.get("categoryLabel"));
      const risk_assessment = JSON.stringify(document.get("risky"));
      const sections_get = JSON.stringify(document.get("sections"));

      let data = {
        success: true,
        header: header,
        original_document: text,
        general_summary: report,
        section_summary: section_summary,
        risk_assessment: risk_assessment,
        sections: sections_get,
      };

      if (saveToDatabase) {
        addUserDocument(userID, document._id, Date.now());
      }

      res.json({ success: true, data: data, documentID: document._id });
    } else {
      const reportData = await generateReport({
        text: text,
        sections: sections,
        userSettings: userSettings,
      });

      const report = reportData.general_summary;
      const section_summary = JSON.stringify(reportData.section_summary);
      const risk_assessment = JSON.stringify(reportData.risk_assessment);

      // Save report to db without sections
      const result = await addDocument(
        textTags,
        report,
        company,
        date,
        category,
        section_summary,
        risk_assessment,
        null,
        readability
      );

      // Data for extension
      const data = {
        success: true,
        header: header,
        original_document: text,
        general_summary: report,
        section_summary: section_summary,
        risk_assessment: risk_assessment,
      };

      if (saveToDatabase) {
        addUserDocument(userID, result._id, Date.now());
      }

      res.json({ success: true, data: data, documentID: result._id });

      // Generate sections
      const sectionsData = await generateSections({
        text: text,
        sections: sections,
      });

      const sections_get = JSON.stringify(sectionsData.sections);

      // Update the document with the sections
      await Document.updateOne(
        { _id: result._id },
        { $set: { sections: sections_get } }
      );
    }
  } catch (error) {
    console.error("Failed to generate report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: error.message,
    });
  }
});

app.post("/getLatestReport", authenticateToken, async (req, res) => {
  try {
    const userID = req.user.userId;
    const selectInfo = await getUserLatestDocument(userID);
    io.emit("selectDocument", selectInfo);
    // TODO: check bug here
    console.log("Get latest report from getLatestReport");
    res.json({ success: true, information: selectInfo });
  } catch (error) {
    console.error(error); // Log the error to the server console
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/response-docID", authenticateToken, async (req, res) => {
  try {
    const { documentID } = req.body;
    // TODO: check bug here
    console.log(
      "Received request for /response-docID with documentID:",
      documentID
    );
    const selectInfo = await pullUpDocandRepByDocID(documentID);
    io.emit("selectDocument", selectInfo);
    res.json({ success: true, information: selectInfo });
  } catch (error) {
    console.error(error); // Log the error to the server console
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/download-pdf", async (req, res) => {
  const { documentID } = req.body;
  try {
    console.log("Downloading PDF with documentID:", documentID);
    //resawait downloadPDF(documentID, res);
    document = await downloadPDF(documentID, res);
    //res.status(200).json({ success: true, information: document });
    //res.json({ success: true, message: 'PDF downloaded successfully' });
  } catch (error) {
    console.error("Error in download route:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve PDF: " + error.message,
    });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      securityQuestion,
      securityAnswer,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password and security answer
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecurityAnswer = await bcrypt.hash(
      securityAnswer.toLowerCase(),
      10
    );

    // await verificationCode(email.toLowerCase(), firstName + ' ' + lastName);

    addUser(
      email.toLowerCase(),
      hashedPassword,
      firstName,
      lastName,
      securityQuestion,
      hashedSecurityAnswer
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post(
  "/upload-pdf",
  upload.single("file"),
  authenticateToken,
  async (req, res) => {
    console.log("Received request for /upload-pdf");
    if (req.file && req.file.buffer) {
      try {
        const userID = req.user.userId;
        console.log("uploading PDF from app.post(/upload-pdf)");
        const text = await convertPdfToText(req.file.buffer);
        // TODO: fetch python process pdf
        await generateReportByPDF(
          req.file.buffer,
          text,
          userSettings,
          io,
          userID
        );
        res.json({ success: true, text: text });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to convert PDF to text",
          error: error.message,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "No file uploaded" });
    }
  }
);
// Declare a variable to store user settings (default settings can be placed here)
let userSettings = {
  numberOfSections: 3,
  summaryLength: 100,
  reportSpeed: 4,
};

// Endpoint to handle POST request to update user settings
app.post("/api/settings", (req, res) => {
  const { numberOfSections, summaryLength, reportSpeed } = req.body;
  // Update the settings with received data
  userSettings = {
    numberOfSections,
    summaryLength,
    reportSpeed,
  };
  console.log("Updated user settings:", userSettings);
  // Respond with success message
  res
    .status(200)
    .json({ success: true, message: "Settings updated successfully" });
});

// Route to handle form submissions
app.post("/submit-issue", upload.single("issue-image"), (req, res) => {
  try {
    const emailData = {
      sender: { name: "Wrap Support Team", email: "wrapcapstone01@gmail.com" },
      to: [{ email: req.body.email, name: "Wrap User" }],
      cc: [{ email: "wrapcapstone01@gmail.com", name: "Wrap" }],
      subject: "Your Issue Report Has Been Received",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="http://localhost:${port}" style="text-decoration: none;" target="_blank">
              <div style="border-radius: 50%; width: 80px; height: 80px; margin: 0 auto; border: 2px solid #333; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 36px; font-weight: bold; color: #333;">W</span>
              </div>
            </a>
          </div>
          <p>Dear User,</p>
          <p>Thank you for reaching out to us. We have received your issue report and our Support Team is reviewing it.</p>
          <hr style="border: 1px solid #999; margin: 20px 0;">
          <p><strong>Issue:</strong></p>
          <p>${req.body["issue-description"]}</p>
          <hr style="border: 1px solid #999; margin: 20px 0;">
          <p>If you provided additional details or a file, our team will review it carefully to resolve your issue as quickly as possible. You can expect to hear back from us shortly.</p>
          <p>Best regards,</p>
          <p><strong>Wrap Support Team</strong></p>
        </div>
      `,
    };

    axios
      .post("https://api.brevo.com/v3/smtp/email", emailData, {
        headers: {
          accept: "application/json",
          "api-key": BREVO_API_KEY,
          "content-type": "application/json",
        },
      })
      .then((response) => {
        console.log("Email sent:", response.data);
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      });
    // Respond to the client
    res.status(200).json({ message: "Issue report received successfully!" });
  } catch (error) {
    console.error("Error processing form:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the form." });
  }
});

app.post("/process-question", async (req, res) => {
  const { question, documentID } = req.body;

  try {
    const document = await Document.findOne({ _id: documentID }); // 通过 documentID 查找文档
    const original_document = document ? document.documentFile : null;

    if (!original_document) {
      return res.json({
        success: false,
        answer: "Original document not found.",
      });
    }

    const response = await axios.post(
      "https://implicitly-sacred-moose.ngrok-free.app/get-QA",
      {
        text: original_document,
        question: question,
      }
    );

    if (response.data.success) {
      return res.json({ success: true, answer: response.data.answer });
    } else {
      return res.json({
        success: false,
        answer: "NLP service could not find an answer.",
      });
    }
  } catch (error) {
    console.error("Error communicating with NLP service:", error);
    return res.json({
      success: false,
      answer: "Error contacting NLP service.",
    });
  }
});

app.post("/get-report-by-documentID", authenticateToken, async (req, res) => {
  const { documentID } = req.body;

  try {
    const documentData = await pullUpDocandRepByDocID(documentID);

    console.log(
      "The current document infomation is: " + JSON.stringify(documentData)
    );

    if (documentData) {
      io.on("connection", (socket) => {
        console.log("Sending document data to client:", socket.id);
        socket.emit("selectDocument", documentData); // Send the data to the connected client
      });
      // io.emit("selectDocument", documentData);
      console.log("Received Document id correctly");
      res.json({ success: true, data: documentData });
    } else {
      res.status(404).json({ success: false, message: "Document not found" });
    }
  } catch (error) {
    console.error("Error fetching document by ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving document data" });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const isExpired = err.name === "TokenExpiredError";
      const statusCode = isExpired ? 401 : 403;
      const message = isExpired ? "Token expired" : "Invalid token";

      return res.status(statusCode).json({ message });
    }

    req.user = user;
    next();
  });
}

app.post("/api/get-security-question", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ securityQuestion: user.securityQuestion });
  } catch (error) {
    console.error("Error fetching security question:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/reset-password", async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAnswerMatch = await bcrypt.compare(
      securityAnswer.toLowerCase(),
      user.securityAnswer
    );

    if (!isAnswerMatch) {
      return res.status(400).json({ message: "Incorrect security answer" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/verification-code", async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const verificationCode = crypto
      .randomInt(0, Math.pow(10, 6))
      .toString()
      .padStart(6, "0");

    const token = jwt.sign(
      { email, code: verificationCode },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );

    const emailData = {
      sender: { name: "Wrap", email: "wrapcapstone01@gmail.com" },
      to: [{ email: email, name: name || "User" }],
      subject: "Wrap Verification Code",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="text-align: center; color: #333;">Verification Code</h2>
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="http://localhost:${port}" style="text-decoration: none;" target="_blank">
              <div style="border-radius: 50%; width: 80px; height: 80px; margin: 0 auto; border: 2px solid #333; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 36px; font-weight: bold; color: #333;">W</span>
              </div>
            </a>
          </div>
          <p>Dear ${name},</p>
          <p>Thank you for using our service. Here is your verification code:</p>
          <div style="text-align: center; margin: 20px;">
            <span style="font-size: 24px; font-weight: bold; color: #007BFF;">${verificationCode}</span>
          </div>
          <p>Please enter this code on the website or app to complete your verification. This code is valid for 10 minutes.</p>
          <p>If you did not request this code, please ignore this email or contact our support team.</p>
          <p>Best regards,</p>
          <p><strong>Wrap Support Team</strong></p>
        </div>
      `,
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
    });

    console.log("Email sent to:", email);
    return res.status(200).json({ message: "Verification code sent.", token });
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({ message: "Failed to send verification code." });
  }
});

app.post("/api/send-graphs-email", async (req, res) => {
  const { email, name, pdfData } = req.body;
  console.log("Received request to send email with PDF data:", { email, name });
  if (!email || !pdfData) {
    return res
      .status(400)
      .json({ message: "Email and PDF data are required." });
  }

  try {
    const emailData = {
      sender: { name: "Wrap", email: "wrapcapstone01@gmail.com" },
      to: [{ email: email, name: name || "User" }],
      subject: "Wrap Monthly Graph Report",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="http://localhost:${port}" style="text-decoration: none;" target="_blank">
              <div style="border-radius: 50%; width: 80px; height: 80px; margin: 0 auto; border: 2px solid #333; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 36px; font-weight: bold; color: #333;">W</span>
              </div>
            </a>
          </div>
          <p>Hello ${name || "User"},</p>
          <p>Please find attached the PDF containing your monthly report.</p>
          <p>Best regards,<br/>Wrap Team</p>
        </div>
      `,
      attachment: [
        {
          content: pdfData, // base64 encoded content
          name: "charts.pdf",
        },
      ],
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
    });

    console.log("Email sent to:", email);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Error sending email." });
  }
});

app.post("/api/verify-code", (req, res) => {
  const { token, enteredCode } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.code === enteredCode) {
      res.status(200).json({ message: "Verification successful" });
    } else {
      res.status(400).json({ message: "Invalid code" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

app.post("/api/reset-password-with-code", async (req, res) => {
  const { email, code, token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (decoded.code === code) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;

      await user.save();

      res.status(200).json({ message: "Verification successful" });
    } else {
      res.status(400).json({ message: "Invalid code" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});
