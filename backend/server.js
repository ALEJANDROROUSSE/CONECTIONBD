const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const PORT = 5000; // Asegúrate de que este puerto coincida con el que usas en tu frontend

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia esto a tu usuario de MySQL
  password: '', // Cambia esto a tu contraseña de MySQL
  database: 'formulario' // Tu base de datos
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Rutas
app.post('/api/estudiantes', (req, res) => {
  const { documento, nombre, apellidoPaterno, telefono, correo } = req.body;
  const query = 'INSERT INTO estudiantes (documento, nombre, apellido_paterno, telefono, correo) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [documento, nombre, apellidoPaterno, telefono, correo], (err, result) => {
    if (err) {
      console.error('Error al insertar datos:', err);
      return res.status(500).send(err);
    }
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Obtener estudiantes
app.get('/api/estudiantes', (req, res) => {
  db.query('SELECT * FROM estudiantes', (err, results) => {
    if (err) {
      console.error('Error al obtener datos:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Eliminar estudiante
app.delete('/api/estudiantes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM estudiantes WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar datos:', err);
      return res.status(500).send(err);
    }
    res.sendStatus(204);
  });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
