// backend/routes/hashRoutes.js
const express = require('express');
const router = express.Router();
const { hashAndUpload } = require('../controllers/hashController');

router.post('/upload', hashAndUpload);

module.exports = router;
