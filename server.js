const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('public'));

// TUS CLAVES DE LA FOTO YA INTEGRADAS
cloudinary.config({
  cloud_name: 'dy9hxg3za',
  api_key: '222789433462569',
  api_secret: 'pmd3FkYsjDELgnWUHJ4jD-tTaUM'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'fotos_evento',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('fotos'), (req, res) => {
  res.status(200).send('Subido con éxito');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});