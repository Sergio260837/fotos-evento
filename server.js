const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('public'));

// CONFIGURACIÓN DE TU CUENTA (Ya integrada)
cloudinary.config({
  cloud_name: 'dy9hxg3za',
  api_key: '222789433462569',
  api_secret: 'pmd3FkYsjDELgnWUHJ4jD-tTaUM'
});

// Configuración de almacenamiento para que se guarden en la carpeta 'fotos_evento'
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'fotos_evento',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// 1. RUTA PARA SUBIR LAS FOTOS
app.post('/upload', upload.array('fotos'), (req, res) => {
  console.log("Fotos recibidas y enviadas a Cloudinary");
  res.status(200).send('Subido con éxito');
});

// 2. RUTA PARA LA GALERÍA (Obtiene la lista de fotos subidas)
app.get('/galeria', async (req, res) => {
    try {
        const { resources } = await cloudinary.search
            .expression('folder:fotos_evento') // Busca en tu carpeta
            .sort_by('created_at', 'desc')     // Las más recientes primero
            .max_results(100)                  // Límite de 100 fotos
            .execute();
        
        // Extraemos solo las URLs de las imágenes
        const urls = resources.map(file => file.secure_url);
        res.json(urls);
    } catch (error) {
        console.error("Error en galería:", error);
        res.status(500).json({ error: 'Error al cargar la galería' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando perfectamente en puerto ${PORT}`);
});
