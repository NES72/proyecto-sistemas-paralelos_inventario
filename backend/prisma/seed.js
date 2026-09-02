const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  const electronica = await prisma.categoria.upsert({
    where: { nombre: 'Electrónica' },
    update: {},
    create: {
      nombre: 'Electrónica',
      descripcion: 'Equipos y accesorios electrónicos'
    }
  });

  const oficina = await prisma.categoria.upsert({
    where: { nombre: 'Oficina' },
    update: {},
    create: {
      nombre: 'Oficina',
      descripcion: 'Productos y materiales de oficina'
    }
  });

  const herramientas = await prisma.categoria.upsert({
    where: { nombre: 'Herramientas' },
    update: {},
    create: {
      nombre: 'Herramientas',
      descripcion: 'Herramientas para trabajo y mantenimiento'
    }
  });

  const teclado = await prisma.producto.upsert({
    where: { codigo: 'PROD-0001' },
    update: {},
    create: {
      codigo: 'PROD-0001',
      nombre: 'Teclado USB',
      descripcion: 'Teclado USB para computadora',
      precio: 85.00,
      stock: 20,
      stockMinimo: 5,
      categoriaId: electronica.id
    }
  });

  const mouse = await prisma.producto.upsert({
    where: { codigo: 'PROD-0002' },
    update: {},
    create: {
      codigo: 'PROD-0002',
      nombre: 'Mouse USB',
      descripcion: 'Mouse óptico USB',
      precio: 45.00,
      stock: 30,
      stockMinimo: 10,
      categoriaId: electronica.id
    }
  });

  const cuaderno = await prisma.producto.upsert({
    where: { codigo: 'PROD-0003' },
    update: {},
    create: {
      codigo: 'PROD-0003',
      nombre: 'Cuaderno universitario',
      descripcion: 'Cuaderno de 100 hojas',
      precio: 18.00,
      stock: 50,
      stockMinimo: 10,
      categoriaId: oficina.id
    }
  });

  const martillo = await prisma.producto.upsert({
    where: { codigo: 'PROD-0004' },
    update: {},
    create: {
      codigo: 'PROD-0004',
      nombre: 'Martillo',
      descripcion: 'Martillo de acero',
      precio: 75.00,
      stock: 8,
      stockMinimo: 3,
      categoriaId: herramientas.id
    }
  });

  const destornillador = await prisma.producto.upsert({
    where: { codigo: 'PROD-0005' },
    update: {},
    create: {
      codigo: 'PROD-0005',
      nombre: 'Destornillador',
      descripcion: 'Destornillador de punta plana',
      precio: 35.00,
      stock: 12,
      stockMinimo: 5,
      categoriaId: herramientas.id
    }
  });

  await prisma.movimientoInventario.createMany({
    data: [
      {
        tipo: 'ENTRADA',
        cantidad: 20,
        motivo: 'Carga inicial del inventario',
        productoId: teclado.id
      },
      {
        tipo: 'ENTRADA',
        cantidad: 30,
        motivo: 'Carga inicial del inventario',
        productoId: mouse.id
      },
      {
        tipo: 'ENTRADA',
        cantidad: 50,
        motivo: 'Carga inicial del inventario',
        productoId: cuaderno.id
      },
      {
        tipo: 'ENTRADA',
        cantidad: 8,
        motivo: 'Carga inicial del inventario',
        productoId: martillo.id
      },
      {
        tipo: 'ENTRADA',
        cantidad: 12,
        motivo: 'Carga inicial del inventario',
        productoId: destornillador.id
      }
    ]
  });

  console.log('Categorías creadas correctamente.');
  console.log('Productos creados correctamente.');
  console.log('Movimientos iniciales creados.');
  console.log('Seed completado correctamente.');
}

main()
  .catch((error) => {
    console.error('Error ejecutando seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
