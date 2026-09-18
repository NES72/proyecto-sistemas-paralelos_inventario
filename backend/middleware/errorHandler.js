export function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  if (err.message?.includes('Unique constraint')) {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor' });
  }

  if (err.message?.includes('Record to update/delete does not exist')) {
    return res.status(404).json({ error: 'Registro no encontrado' });
  }

  if (err.message?.includes('Foreign key constraint')) {
    return res.status(400).json({ error: 'Referencia inválida: el registro asociado no existe' });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
}
