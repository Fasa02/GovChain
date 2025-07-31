# 📦 GovChain Permit — Backend

Backend untuk aplikasi **GovChain Permit**, sebuah DApp (Decentralized Application) yang memungkinkan pengguna mengunggah dokumen izin (PDF), melakukan hashing (SHA256), dan mengunggah hash-nya ke IPFS **lokal** melalui REST API.

---

## 📁 Struktur Folder

```bash
backend/
├── controllers/
│   └── hashController.js     # Logika hashing dan upload ke IPFS
├── routes/
│   └── hashRoutes.js         # Endpoint routing untuk /api/hash
├── temp/                     # Folder sementara untuk menyimpan file yang diunggah
├── ipfsClient.js             # Koneksi ke node IPFS lokal (port 5001)
├── index.js                  # Entry point Express server
├── .env                      # Konfigurasi environment
└── README.md                 # Dokumentasi ini
🚀 Fitur Utama
✅ Mengunggah file PDF melalui REST API

🔐 Menghasilkan hash SHA-256 dari isi file

📡 Mengunggah hash ke IPFS node lokal

🔗 Mendapatkan CID dan gateway URL IPFS

📦 Dependencies
1. express
2. express-fileupload
3. axios
4. form-data
5. dotenv
6. crypto (built-in)
7. fs & path (built-in)

⚙️ Cara Menjalankan
Clone repo dan masuk ke folder backend

bash
Copy
Edit
cd govchain-permit/backend
Install dependencies

bash
Copy
Edit
npm install
Buat file .env jika perlu
.env:

PORT=3000

start server:
node index.js

Output:

✅ Backend server running on http://localhost:3000
📤 Endpoint API
POST /api/hash/upload
Deskripsi: Upload file PDF, hashing SHA256, upload hash ke IPFS.

Headers: Content-Type: multipart/form-data

Body: Form-data

file: PDF file yang ingin diunggah

Contoh Response:

json
{
  "message": "Hash uploaded to IPFS.",
  "hash": "0d77...b1ec",
  "ipfsCID": "QmRFz...WEBRLk",
  "gatewayURL": "https://ipfs.io/ipfs/QmRFz...WEBRLk"
}


🧪 Testing dengan Postman
Method: POST

URL: http://localhost:3000/api/hash/upload

Body: form-data dengan field file (pilih file .pdf)

Tekan Send

🧩 Catatan
File hash diunggah ke IPFS lokal (localhost:5001).

File tidak otomatis muncul di IPFS Desktop kecuali menggunakan ?pin=true.

Pastikan folder temp/ tersedia agar tidak terjadi error ENOENT.

🛠 Rencana Pengembangan
 Verifikasi hash melalui smart contract Solidity

 Integrasi WebSocket & Scanner API

 Upload file asli ke IPFS (opsional)