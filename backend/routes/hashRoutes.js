const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const { hashAndUpload } = require('../controllers/hashController');

// endpoint /api/hash/upload
router.post('/upload', upload.single('file'), hashAndUpload);

module.exports = router;
