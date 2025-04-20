const express = require('express');
const PDFDocument = require('pdfkit');

const app = express();

app.get('/factura', (req, res) => {
  const doc = new PDFDocument({ size: [226, 600], margin: 10 });

  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    const pdf = Buffer.concat(buffers);
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=factura.pdf',
      'Content-Length': pdf.length
    });
    res.end(pdf);
  });

  // Fuente tipo consola (monoespaciada)
  doc.font('Courier-Bold').fontSize(10);

  // Logo si lo tienes local, por ahora omitido
  // doc.image('logo.png', { width: 80, align: 'center' });

  doc
    .text('LOGO AZUMI', { align: 'center' })
    .text('RESTAURANTE AZUMI PTY', { align: 'center', fontSize: 20 })
    .text('JORGE DIAZ', { align: 'center', fontSize: 20 })
    .text('SAN FRANCISCO, PLAZA 72', { align: 'center', fontSize: 20 })
    .text('CALLE 72, LOCAL N 3', { align: 'center', fontSize: 20 })
    .text('FRENTE A INSTITUTO ENRICO F', { align: 'center', fontSize: 20 })
    .moveDown(0.5);

  doc
    .text('RUC: 8-NT-2-751131 DV 03')
    .text('CIP: 1234567890 00')
    .text('CLIENTE CONTADO')
    .text('Correlativo: 032194')
    .text('Dirección: PANAMÁ')
    .text('Fecha: 20-04-2025 02:42 p.m.')
    .text('Vendedor: 03 DIANA DIAZ')
    .text('Zona: SALON')
    .text('Mesa 5')
    .text('Comensal 1')
    .moveDown(0.5);

  doc.font('Courier-Bold').text('FACTURA', { align: 'center' }).moveDown(0.3);
  doc.text('FACTURA:    TFHKC20002408-00031754');
  doc.text('FECHA:                  20-04-2025');
  doc.text('HORA:                        15:50');
  doc.moveDown(0.5);

  doc.text('----------------------------------');

  // Aquí definimos los productos, ahora con precios
  const productos = [
    { nombre: 'A00 2 POTES 1/2 DE ARROZ FRITO (E)', detalle: '+ 1/2 POLLO A', precio: 'B/. 5.99' },
    { nombre: 'B00 1 PORCION DE SUSHI', detalle: '+ 3 PIEZAS CALIFORNIA', precio: 'B/. 8.99' },
    { nombre: 'C00 1 PLATO DE SOPA', detalle: '+ FIDEO CON POLLO', precio: 'B/. 4.99' },
  ];

  let yPosition = doc.y; // Empezamos a imprimir desde la posición actual

  productos.forEach(producto => {
    // Columna izquierda (nombre)
    doc.text(producto.nombre, { width: 203, align: 'left', continued: true });

    // Columna central (detalle)
    doc.text(producto.detalle, { width: 50, align: 'left', continued: true });

    // Columna derecha (precio)
    doc.text(producto.precio, { width: 50, align: 'right' });

    // Movemos la posición hacia abajo para la siguiente línea
    yPosition += 15;
    doc.moveDown(0.3);
  });

  doc.text('----------------------------------');
  doc.moveDown(0.2);
  doc.text('SUBTOTAL                 B/. 19.99');
  doc.text('----------------------------------');
  doc.moveDown(0.2);
  doc.text('EXENTO                   B/. 19.99');
  doc.text('----------------------------------');
  doc.moveDown(0.2);
  doc.text('TOTAL                    B/. 19.99');
  doc.text('----------------------------------');
  doc.moveDown(0.2);
  doc.text('TARJETA 1                B/. 19.99');
  doc.moveDown(1);
  doc.text('DGI                  TFHKC20002408');

  doc.end();
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000/factura');
});
