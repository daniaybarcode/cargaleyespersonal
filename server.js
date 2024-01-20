const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const lawsFilePath = 'laws.json';

// Ruta para obtener todas las leyes
app.get('/laws', (req, res) => {
  const laws = loadLaws();
  res.json(laws);
});

// Ruta para agregar una nueva ley
app.post('/alta', (req, res) => {
  const { category, type, content } = req.body;
  addLaw(category, type, content);
  res.redirect('/');
});

// Ruta para modificar una ley existente
app.post('/modificacion', (req, res) => {
  const { category, type, content } = req.body;
  updateLaw(category, type, content);
  res.redirect('/');
});

// Función para cargar las leyes desde el archivo JSON
function loadLaws() {
  try {
    const lawsData = fs.readFileSync(lawsFilePath, 'utf8');
    return JSON.parse(lawsData);
  } catch (error) {
    // Si hay un error al leer el archivo o el archivo no existe, devolvemos un objeto vacío
    return {};
  }
}

// Función para guardar las leyes en el archivo JSON
function saveLaws(laws) {
  const lawsData = JSON.stringify(laws, null, 2);
  fs.writeFileSync(lawsFilePath, lawsData);
}

// Función para agregar una nueva ley
function addLaw(category, type, content) {
  const laws = loadLaws();

  if (!laws[category]) {
    laws[category] = {};
  }

  if (!laws[category][type]) {
    laws[category][type] = [];
  }

  laws[category][type].push(content);

  saveLaws(laws);
}

// Función para modificar una ley existente
function updateLaw(category, type, content) {
  const laws = loadLaws();

  if (laws[category] && laws[category][type]) {
    // Buscar y actualizar la ley
    const index = laws[category][type].findIndex((law) => law === content);
    if (index !== -1) {
      laws[category][type][index] = content;
      saveLaws(laws);
    }
  }
}

app.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
});
