// backend/index.js
const express = require('express');
const fileUpload = require('express-fileupload');
const hashRoutes = require('./routes/hashRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(fileUpload());
app.use('/api/hash', hashRoutes);

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
