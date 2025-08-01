const express = require('express');
const router = express.Router();
const fs = require('fs');
const { uploadToLocalIPFS } = require('../utils/ipfsClient');

// Upload route
router.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    const tempPath = `${__dirname}/../temp/${file.name}`;
    
    // Save file temporarily
    await file.mv(tempPath);
    
    // Upload to IPFS
    const ipfsHash = await uploadToLocalIPFS(tempPath);
    
    // Clean up temp file
    fs.unlinkSync(tempPath);
    
    res.json({
      success: true,
      hash: ipfsHash,
      message: 'File uploaded to IPFS successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add mint route
router.post('/mint', async (req, res) => {
  try {
    const summary = req.body;
    console.log('📄 Received summary:', summary);

    // Validate input
    if (!summary || !summary.ipfsHash) {
      return res.status(400).json({ 
        success: false,
        error: 'IPFS hash is required' 
      });
    }

    // Return the IPFS hash
    res.json({
      success: true,
      hash: summary.ipfsHash,
      message: 'Document registered successfully'
    });

  } catch (error) {
    console.error('Minting error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;