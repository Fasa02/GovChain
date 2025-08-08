const express = require('express');
const router = express.Router();
const fs = require('fs');
const { uploadToLocalIPFS } = require('../utils/ipfsClient');
const path = require('path');

// Upload route
router.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    const tempPath = path.join(__dirname, '..', 'temp', file.name);

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

// Mint route
router.post('/mint', async (req, res) => {
  try {
    const summary = req.body;
    console.log('📄 Received summary:', summary);

    if (!summary || !summary.ipfsHash) {
      return res.status(400).json({ success: false, error: 'IPFS hash is required' });
    }

    // Buat file metadata JSON
    const metadata = {
      jumlah: summary.jumlah,
      jenis: summary.jenis,
      pemilik: summary.pemilik,
      terbit: summary.terbit,
      sampai: summary.sampai,
      ipfs_pdf: summary.ipfsHash
    };

    const metadataPath = path.join(__dirname, '..', 'temp', `metadata-${Date.now()}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    // Upload metadata JSON ke IPFS
    const metadataHash = await uploadToLocalIPFS(metadataPath);

    // Hapus file sementara
    fs.unlinkSync(metadataPath);

    // ✅ Kirim metadataHash ke frontend
    res.json({
      success: true,
      metadataHash: metadataHash,
      message: 'Metadata uploaded and ready to mint'
    });

  } catch (error) {
    console.error('Minting error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;