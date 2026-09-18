#!/bin/sh
set -e

echo "Esperando a que PostgreSQL esté listo..."

node -e "
const net = require('net');
const url = new URL(process.env.DATABASE_URL);
const host = url.hostname;
const port = url.port || 5432;
let tries = 0;
function attempt() {
  const s = net.connect(port, host);
  s.on('connect', () => { console.log('PostgreSQL listo.'); s.destroy(); process.exit(0); });
  s.on('error', () => {
    s.destroy();
    tries++;
    if (tries >= 40) { console.error('PostgreSQL no disponible.'); process.exit(1); }
    setTimeout(attempt, 2000);
  });
}
attempt();
"

echo "Aplicando migraciones..."
npx prisma db migrate

echo "Ejecutando seed..."
node prisma/seed.js

echo "Iniciando servidor..."
exec node server.js