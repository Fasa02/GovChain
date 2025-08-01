const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

/**
 * Uploads a file to local IPFS node
 * @param {string} filePath - Path to the file to upload
 * @returns {Promise<string>} IPFS hash of uploaded file
 */
async function uploadToLocalIPFS(filePath) {
  // Input validation
  if (!filePath) {
    throw new Error('File path is required');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }

  // Create form data
  const form = new FormData();
  const fileStream = fs.createReadStream(filePath);
  form.append('file', fileStream);

  try {
    // Configure IPFS API request
    const res = await axios.post('http://127.0.0.1:5001/api/v0/add', form, {
      headers: {
        ...form.getHeaders(),
        'Accept': 'application/json'
      },
      params: {
        pin: true,
        'wrap-with-directory': false,
        'only-hash': false
      },
      timeout: 30000 // 30 second timeout
    });

    if (!res.data || !res.data.Hash) {
      throw new Error('Invalid response from IPFS');
    }

    console.log('✅ File uploaded to IPFS successfully');
    console.log('📍 IPFS Hash:', res.data.Hash);
    
    return res.data.Hash;

  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('❌ IPFS connection error:', err.message);
      throw new Error(`IPFS connection failed: ${err.message}`);
    }
    console.error('❌ Upload failed:', err.message);
    throw err;
  } finally {
    // Clean up: close the file stream
    fileStream.destroy();
  }
}

/**
 * Gets file info from IPFS by hash
 * @param {string} hash - IPFS hash to look up
 * @returns {Promise<Object>} File information
 */
async function getFromIPFS(hash) {
  try {
    const response = await axios.post(`http://127.0.0.1:5001/api/v0/object/get?arg=${hash}`);
    return response.data;
  } catch (err) {
    console.error('❌ Failed to get file from IPFS:', err.message);
    throw err;
  }
}

/**
 * Checks if IPFS node is running
 * @returns {Promise<boolean>} True if IPFS is running
 */
async function checkIPFSConnection() {
  try {
    await axios.get('http://127.0.0.1:5001/api/v0/version');
    console.log('✅ IPFS node is running');
    return true;
  } catch (err) {
    console.error('❌ IPFS node is not running');
    return false;
  }
}

module.exports = {
  uploadToLocalIPFS,
  getFromIPFS,
  checkIPFSConnection
};