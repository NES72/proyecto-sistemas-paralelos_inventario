const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Backend del Sistema de Gestión de Inventario',
    estado: 'activo'
  });
});

app.get('/health', (req, res) => {
  res.json({
    estado: 'ok'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend ejecutándose en el puerto ${PORT}`);
});
