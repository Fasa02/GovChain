// backend/controllers/hashController.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { uploadToLocalIPFS } = require('../utils/ipfsClient');

const hashAndUpload = async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    const pdfFile = req.files.pdf;
    const tempPath = path.join(__dirname, '../temp/', pdfFile.name);

    // Simpan file sementara
    await pdfFile.mv(tempPath);

    // Buat hash dari file PDF
    const fileBuffer = fs.readFileSync(tempPath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Simpan hash ke file sementara
    const hashFilePath = path.join(__dirname, '../temp/', `${pdfFile.name}.txt`);
    fs.writeFileSync(hashFilePath, hash);

    // Upload file hash ke IPFS lokal
    const cid = await uploadToLocalIPFS(hashFilePath);

    // Cleanup
    fs.unlinkSync(tempPath);
    fs.unlinkSync(hashFilePath);

    res.status(200).json({
      message: 'Hash uploaded to IPFS.',
      hash,
      ipfsCID: cid,
      gatewayURL: `http://localhost:8081/ipfs/${cid}`
    });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { hashAndUpload };
