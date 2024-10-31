const DocumentModel = require('../dbModels/documentModel');

exports.getDocuments = async (req, res) => {
    try {
        const documents = await DocumentModel.findAll();
        res.json(documents);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.addDocument = async (req, res) => {
    try {
        const document = await DocumentModel.create(req.body);
        res.status(201).json(document);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

