const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.get('/', documentController.getDocuments);
router.post('/', documentController.addDocument);

// Add other endpoints as needed...

module.exports = router;
