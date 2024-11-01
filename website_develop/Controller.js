// service.js
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const {
  addDocument,
  addUserDocument,
  getLastReportDocumentID,
  getNumOfUserDoc,
  fetchUserDocuments,
  pullUpDocandRepByDocID,
  getFlag,
  setFlag,
  getFlagNum,
  getUserInfo,
} = require("./dbModels/DAO.js");
const Document = require("./dbModels/document.js");
const pdf = require("pdf-parse");
console.log(Document);

async function processData(data) {
  const { text, url, title, headers, footer } = data;

  console.log("Processing Data:", data);

  if (url.startsWith("wrapcapstone.com")) {
    console.log("Skipping processing for internal app URL");
    return { success: false, message: "Internal app URLs are not processed" };
  }

  try {
    const response = await axios.post(
      "https://60d1-73-98-181-213.ngrok-free.app/process-url",
      {
        data,
      }
    );

    console.log("Response Data is :" + response.data);

    return response.data;
  } catch (error) {
    console.error("Error processing text with NLP service:", error);
    return {
      success: false,
      message: "Error processing text with NLP service",
      error: error.message,
    };
  }
}

async function convertPdfToText(pdfBuffer) {
  if (!pdfBuffer || pdfBuffer.length === 0) {
    console.error("Empty or undefined PDF buffer");
    throw new Error("Empty or undefined PDF buffer");
  }

  try {
    let data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Error converting PDF to text:", error);
    throw error;
  }
}

// async function saveReport(text) {
//   savedReport = text;
// }

async function generateReport(data) {
  try {
    console.log("Generating report with NLP service");
    const response = await axios.post(
      "https://60d1-73-98-181-213.ngrok-free.app/generate-report",
      {
        data,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating report with NLP service:", error);
    throw error;
  }
}

async function generateSections(data) {
  try {
    //
    https: console.log("Generating sections with NLP service");
    const response = await axios.post(
      "https://60d1-73-98-181-213.ngrok-free.app/generate-sections",
      {
        data,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating report with NLP service:", error);
    throw error;
  }
}

async function generateTitleReportByPDF(text) {
  try {
    console.log("Generating report with NLP service(generateTitleReportByPDF)");
    const response = await axios.post(
      "https://60d1-73-98-181-213.ngrok-free.app/get-PDF-info",
      {
        text,
      }
    );
    console.log(
      "Server received response from NLP service(generateTitleReportByPDF)"
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error generating report with NLP service(generateTitleReportByPDF):",
      error
    );
    throw error;
  }
}
function parseRisk(doc, riskyContent) {
  doc.moveDown();
  doc.fontSize(14).text("Risk Assessment:");

  if (Array.isArray(riskyContent)) {
    riskyContent.forEach((risk) => {
      const [category, details] = Object.entries(risk)[0];
      doc
        .fontSize(12)
        .text(`${category} (Score: ${details.Score})`, { paragraphGap: 4 });
      doc.fontSize(10).text(details.Explanation, { paragraphGap: 10 });
    });
  } else {
    doc.fontSize(12).text("No risk assessment available", { paragraphGap: 10 });
  }
}
async function downloadPDF(documentID, res) {
  try {
    const document = await Document.findById(documentID);
    if (!document) {
      console.log("Document not found");
      return res.status(404).send("Document not found");
    }

    const categoryLabelContent =
      document.categoryLabel || "No category labels available";
    const originalDocumentContent =
      document.documentFile || "No original document available";
    const riskyContent = document.risky || "No risk assessment available";
    const risk_assessment = JSON.parse(riskyContent);

    const formattedRiskAssessment = risk_assessment.map((risk, index) => {
      const key = Object.keys(risk)[0];
      const riskLabel = risk[key];

      return {
        key,
        label: key,
        score: riskLabel.Score,
        explanation: riskLabel.Explanation,
      };
    });

    //parse category label
    const parsed_categoryLabelContent = JSON.parse(categoryLabelContent);
    const formattedSectionSummary = parsed_categoryLabelContent.map(
      (section, index) => {
        const key = Object.keys(section)[0];
        const summary = section[key].Description;
        return { key, summary };
      }
    );

    const parsed_original_doc = JSON.parse(originalDocumentContent);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.companyName}-${Date.now()}.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");

    const doc = new PDFDocument();
    doc.pipe(res);

    // Header
    doc.fontSize(25).text("Document Report", { align: "center" });
    doc.moveDown();

    // Document Information
    doc.fontSize(18).text(`Company: ${document.companyName}`);
    doc
      .fontSize(14)
      .text(
        `Date: ${
          document.documentDate ? document.documentDate.toDateString() : "N/A"
        }`
      );
    doc.text(`Category: ${document.category || "N/A"}`);

    // Category Label
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .text("Risk Category Label:", { paragraphGap: 10 });
    doc.font("Helvetica");
    formattedSectionSummary.map((item, index) => {
      doc.fontSize(12).text(`${item.key}:`);
      doc.fontSize(12).text(item.summary, { paragraphGap: 10 });
    });

    // Risky Content
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .text("Risk Assessment:", { paragraphGap: 10 });
    doc.font("Helvetica");
    formattedRiskAssessment.forEach((item) => {
      doc.fontSize(14).text(item.label);
      doc.fontSize(14).text(`Score: ${item.score}`);
      if (item.explanation) {
        doc.fontSize(14).text("Explanation:");
        doc.fontSize(12).text(item.explanation, { paragraphGap: 10 });
      } else {
        doc.moveDown(); // Add extra space if no explanation
      }
    });

    // Report
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .text("Report:", { paragraphGap: 10 });
    doc.font("Helvetica");
    doc.fontSize(12).text(document.reportFile || "No report available");

    // Original Document
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .text("Original Document:", { paragraphGap: 10 });
    doc.font("Helvetica");
    parsed_original_doc.map((item) => {
      doc.fontSize(12).text(item.content, { paragraphGap: 10 });
    });

    doc.on("finish", () => {
      console.log("PDF generation completed");
    });
    doc.end();
    console.log("PDF generation started");
  } catch (error) {
    console.error("Error:", error);
    if (!res.headersSent) {
      res.status(500).send("Internal server error");
    }
  }
}

// send the content of document to NLP
async function generateReportByPDF(text, userSettings, io, userID) {
  try {
    console.log("Generating report with NLP service");

    const title = await generateTitleReportByPDF(text);

    console.log("Title is:", title);
    const documentDate = new Date(title.date);
    const formattedDate = isNaN(documentDate) ? null : documentDate;

    const oldDocument = await Document.findOne({
      companyName: title.company,
      documentDate: formattedDate,
      category: title.category,
    });

    documentID = "";
    if (oldDocument) {
      documentID = oldDocument._id;

      const data = await pullUpDocandRepByDocID(documentID);
      console.log("the current pdf uploaded is already in the database" + data);
      // saveReport(data);

      io.emit("reportGenerated", data);
    } else {
      console.log("starting generate reprot by PDF");
      const response = await axios.post(
        "https://60d1-73-98-181-213.ngrok-free.app/generate-reportByPDF",
        {
          text: text,
          userSettings: userSettings,
        }
      );
      console.log("report generated by PDF successfully" + response.data);
      // saveReport(response.data);

      const general_summary = response.data.general_summary;
      const section_summary = JSON.stringify(response.data.section_summary);
      const risk_assessment = JSON.stringify(response.data.risk_assessment);
      const sections = JSON.stringify(response.datasections);

      console.log("general_summary:", general_summary);
      console.log("section_summary:", section_summary);
      console.log("risk_assessment:", risk_assessment);
      console.log("sections:", sections);

      const document = await addDocument(
        text,
        general_summary,
        title.company,
        formattedDate,
        title.category,
        section_summary,
        risk_assessment,
        sections
      );

      console.log("generated Document is:", document);
      //localStorage.setItem("documentID", document._id);
      documentID = document._id;

      const reportData = await pullUpDocandRepByDocID(documentID);
      io.emit("reportGenerated", reportData);
    }

    if (userID) {
      //documentID = localStorage.getItem("documentID");
      //console.log(documentID);
      await addUserDocument(userID, documentID, Date.now()).then(
        (userDocument) => {
          fetchUserDocuments(userID).then((documents) => {
            io.emit("reportList", documents);
          });
        }
      );
    }

    console.log("server is sending something to frontend");
  } catch (error) {
    console.error("Error generating report with NLP service:", error);
    throw error;
  }
}

async function getUserLatestDocument(userID) {
  try {
    // Get the latest document ID by the latest report date
    const latestDocumentID = await getLastReportDocumentID(userID);

    if (!latestDocumentID) {
      console.log("No latest document found for the user.");
      return null;
    }

    // Return only the documentID
    return latestDocumentID;
  } catch (error) {
    console.error("Error fetching user latest document:", error);
    return null;
  }
}

async function fetchNumOfUserDoc(userID) {
  try {
    const numOfUserDoc = await getNumOfUserDoc(userID);
    return numOfUserDoc;
  } catch (error) {
    console.error("Error fetching number of user documents:", error);
    throw error;
  }
}

async function toggleFlag(userID, docID) {
  try {
    // Call the setFlag function to toggle the flag for this document and user
    await setFlag(docID, userID);
  } catch (error) {
    console.error("Error toggling flag in controller:", error);
    throw error; // Re-throw the error so that the server.js can handle it
  }
}

async function fetchFlag(userID, docID) {
  try {
    const result = await getFlag(userID, docID);

    if (result.success) {
      return result.flag;
    } else {
      console.log(result.message);
      return false;
    }
  } catch (error) {
    console.error("Error fetching flag of document:", error);
    return false;
  }
}

async function fetchFlagNum(userID) {
  try {
    const flagNum = await getFlagNum(userID);
    return flagNum;
  } catch (error) {
    console.error("Error fetching number of flagged documents:", error);
    throw error;
  }
}

async function fetchUserInfo(userID) {
  try {
    const userInfo = await getUserInfo(userID);
    return userInfo;
  } catch (error) {
    console.error("Error fetching user information:", error);
    throw error;
  }
}

module.exports = {
  processData,
  convertPdfToText,
  // saveReport,
  generateReport,
  generateSections,
  generateReportByPDF,
  downloadPDF,
  getUserLatestDocument,
  fetchNumOfUserDoc,
  fetchNumOfUserDoc,
  fetchFlag,
  toggleFlag,
  fetchFlagNum,
  fetchUserInfo,
};
