const User = require("./user");
const Document = require("./document");
const userDocument = require("./userDocument");

async function addUser(email, password, firstName, lastName, securityQuestion, securityAnswer) {
  try {
    const newUser = new User({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      createDate: Date.now(),
    });

    await newUser.save();
    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: "Server error", error: error.message };
  }
}

async function isContainDocument(
  companyName,
  documentDate,
  category
) {
  if(!companyName && !category)
    {
      console.error("Error adding document.");
      return null;
    }
  
    const validDate = new Date(documentDate);
    const formattedDate = isNaN(validDate) ? null : validDate;
  
    let oldDocument = null;
    if (formattedDate)
    {
      oldDocument = await Document.findOne({
        category: category,
        companyName: companyName,
        documentDate: formattedDate,
      });
    }
    else
    {
      oldDocument = await Document.findOne({
        category: category,
        companyName: companyName,
      });
    }
  
    if (oldDocument) {
      return oldDocument;
    }

    return null;
}

async function addDocument(
  document,
  report,
  companyName,
  documentDate,
  category,
  categoryLabel,
  risky,
  sections,
  readability
) {

  const oldDocument = await isContainDocument(companyName, documentDate, category);
  if (oldDocument)
  {
    return oldDocument;
  }

  const validDate = new Date(documentDate);
  const formattedDate = isNaN(validDate) ? null : validDate;

  const newDocument = new Document({
    documentFile: document,
    reportFile: report,
    companyName: companyName,
    documentDate: formattedDate,
    category: category,
    categoryLabel: categoryLabel,
    risky: risky,
    sections: sections,
    readability: readability
  });

  try {
    const savedDocument = await newDocument.save();
    return savedDocument;
  } catch (error) {
    console.error("Error saving document:", error);
    return null;
  }
}

async function addUserDocument(userID, documentID, reportDate) {
  const oldUserDocument = await userDocument.findOne({
    userID: userID,
    documentID: documentID,
  });

  if (oldUserDocument) {
    await userDocument.updateOne(
      { _id: oldUserDocument },
      {
        $set: {
          reportDate: reportDate,
        },
      }
    );
    return oldUserDocument;
  }

  const newUserDocument = new userDocument({
    userID: userID,
    documentID: documentID,
    reportDate: reportDate,
  });

  try {
    const savedUserDocument = await newUserDocument.save();
    return savedUserDocument;
  } catch (error) {
    console.error("Error saving user document:", error);
    return null;
  }
}

async function fetchUserDocuments(userId) {
  const documents = [];

  const userDocs = await userDocument
    .find({ userID: userId })
    .populate("documentID")
    .sort({ reportDate: -1 })  // Sort in ascending order by reportDate
    .exec();

  for (let userDoc of userDocs) {
    if (userDoc.documentID) {
      documents.push({
        DocumentID: userDoc.documentID.id,
        companyName: userDoc.documentID.companyName,
        reportDate: userDoc.reportDate,
        documentType: userDoc.documentID.category,
        risky: userDoc.documentID.risky,
      });
    }
  }
  console.log("the user id is " + userId);
  console.log(documents);
  return documents;
}

async function deleteUserDocument(userID, documentID) {
  try {
    const result = await userDocument.deleteOne({
      userID: userID,
      documentID: documentID,
    });
    if (result.deletedCount > 0) {
      console.log("User document deleted successfully:", userID, documentID);
    } else {
      console.warn("No document found to delete:", userID, documentID);
    }
  } catch (error) {
    console.error("Error deleting user document:", error);
  }
}

async function getLastReportDocumentID(userID) {
  try {
    console.log("Fetching latest document for userID:", userID);
    const latestUserDocument = await userDocument
      .findOne({ userID: userID })
      .sort({ reportDate: -1 })
      .select("documentID reportDate")
      .exec();

    if (!latestUserDocument) {
      console.log("No reports found for this user.");
      return null;
    }

    console.log("Latest document found:", latestUserDocument);

    return latestUserDocument.documentID;
  } catch (error) {
    console.error("Error retrieving the latest document ID:", error);
    return null;
  }
}

async function getNumOfUserDoc(userID) {
  try {
    // Fetch the count of documents for this userID
    const numOfUserDoc = await userDocument
      .find({ userID: userID })
      .countDocuments()
      .exec();
    console.log("The number of user documents is:", numOfUserDoc);
    return numOfUserDoc; 
  } catch (error) {
    console.error("Error getting number of user documents:", error);
    throw error;
  }
}

async function pullUpDocandRepByDocID(docID) {
  try {
    const document = await Document.findById(docID).exec();

    if (!document) {
      console.log("No document found with the given ID");
      return null;
    }

    const documentName = document.get("companyName");
    const documentCategory = document.get("category");
    const documentDate = document.get("documentDate");
    const documentFile = document.get("documentFile");
    const formattedDate = documentDate.toLocaleDateString("en-CA");
    const header =
      documentName + " - " + documentCategory + " - " + formattedDate;
    const report = document.get("reportFile");
    const section_summary = document.get("categoryLabel");
    const risk_assessment = document.get("risky");
    const sections = document.get("sections");

    return {
      documentID: document._id,
      header: header,
      company: documentName,
      category: documentCategory,
      date: formattedDate,
      original_document: documentFile,
      general_summary: report,
      section_summary: section_summary,
      risk_assessment: risk_assessment,
      sections: sections,
    };
  } catch (error) {
    console.error("Error fetching document and report by document ID:", error);
    throw error;
  }
}
async function setFlag(docID, userID) {
  try {
    const userDocumentEntry = await userDocument.findOne({ documentID: docID, userID: userID }).exec();

    if (!userDocumentEntry) {
      throw new Error(`UserDocument with documentID ${docID} and userID ${userID} not found`);
    }
    const newFlagValue = !userDocumentEntry.flag;

    await userDocument.updateOne(
      { documentID: docID, userID: userID },
      { $set: { flag: newFlagValue } }
    );

    console.log(`Flag toggled to ${newFlagValue} for document ID ${docID} and user ID ${userID}`);
  } catch (error) {
    console.error("Error toggling flag:", error);
    throw error;
  }
}

async function getNumOfUserDoc(userID) {
  try {
    // Fetch the count of documents for this userID
    const numOfUserDoc = await userDocument
      .find({ userID: userID })
      .countDocuments()
      .exec();
    return numOfUserDoc; // <-- Add return statement here
  } catch (error) {
    console.error("Error getting number of user documents:", error);
    throw error;
  }
}

async function getFlag(userID, documentID) {
  try {
    const userDoc = await userDocument.findOne({ userID, documentID }).exec();

    if (!userDoc) {
      return { success: false, message: "Document not found for the user." };
    }
    return { success: true, flag: userDoc.flag };
  } catch (error) {
    console.error("Error retrieving the flag:", error);
    return { success: false, message: "Error retrieving the flag.", error: error.message };
  }
}

async function getFlagNum(userID) {
  try {
    const flagCount = await userDocument
      .find({ userID: userID, flag: true }) 
      .countDocuments()
      .exec();
    return flagCount;
  } catch (error) {
    console.error("Error getting number of flagged documents:", error);
    throw error;
  }
}

//get user information
async function getUserInfo(userID) {
  try {
    const user = await User.findById(userID).select('email firstName lastName createDate').exec();
    
    if (!user) {
      throw new Error(`User with ID ${userID} not found.`);
    }
    const { email, firstName, lastName, createDate } = user;

    return {
      email,
      firstName,
      lastName,
      createDate
    };
  } catch (error) {
    console.error("Error getting user information:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}


module.exports = {
  addDocument,
  isContainDocument,
  addUser,
  addUserDocument,
  fetchUserDocuments,
  pullUpDocandRepByDocID,
  deleteUserDocument,
  getLastReportDocumentID,
  getNumOfUserDoc,
  setFlag,
  getFlag,
  getFlagNum,
  getUserInfo,
};
