// backend/ipfsClient.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function uploadToLocalIPFS(filePath) {
  const form = new FormData();
  form.append('pdf', fs.createReadStream(filePath));

  try {
    const res = await axios.post('http://127.0.0.1:5001/api/v0/add?pin=true', form, {
      headers: form.getHeaders(),
    });
    return res.data.Hash;
  } catch (err) {
    console.error('❌ Gagal upload ke IPFS lokal:', err.message);
    throw err;
  }
}

module.exports = { uploadToLocalIPFS };
