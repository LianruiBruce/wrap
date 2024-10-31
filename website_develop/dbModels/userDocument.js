const mongoose = require('mongoose');

const userDocumentSchema = new mongoose.Schema({
    userID: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    documentID: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Document' 
    },
    reportDate: {
        type: Date,
        required: true
    },
    flag: {
      type: Boolean,
      required: true, 
      default: false  
    }
});

userDocumentSchema.index({ userID: 1, documentID: 1}, { unique: true });

const userDocument = mongoose.model('userDocument', userDocumentSchema);

module.exports = userDocument;