const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  documentFile: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  reportFile: {
    type: String,
    required: false,
  },
  companyName: {
    type: String,
    required: true,
  },
  documentDate: {
    type: Date,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  categoryLabel: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  risky: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  sections: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  readability:{
    type: Number,
    required: false,
  }
});

documentSchema.index(
  { companyName: 1, documentDate: 1, category: 1 },
  { unique: true }
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
