import express from 'express';
import categoriasRouter from './routes/categorias.js';
import productosRouter from './routes/productos.js';
import movimientosRouter from './routes/movimientos.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Backend del Sistema de Gestion de Inventario',
    estado: 'activo'
  });
});

app.get('/health', (req, res) => {
  res.json({ estado: 'ok' });
});

app.use('/api/categorias', categoriasRouter);
app.use('/api/productos', productosRouter);
app.use('/api/movimientos', movimientosRouter);

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend ejecutandose en el puerto ${PORT}`);
});
