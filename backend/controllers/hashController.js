// backend/controllers/hashController.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { uploadToLocalIPFS } = require('../utils/ipfsClient');

const hashAndUpload = async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Tidak ada file yang diupload." });
    }
    console.log("📝 req.file:", req.file);
    // Hash isi file
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Simpan hash sebagai .txt lalu upload ke IPFS (opsional)
    const hashPath = `${filePath}.txt`;
    fs.writeFileSync(hashPath, hash);

    const cid = await uploadToLocalIPFS(hashPath);

    fs.unlinkSync(filePath);
    fs.unlinkSync(hashPath);

    res.json({ message: "Upload dan hash berhasil", hash });
  } catch (err) {
    console.error('❌ Gagal:', err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { hashAndUpload };
