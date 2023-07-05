const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3001;

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'laboratorio15'
});

// Conexión a la base de datos
connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a MySQL: ', error);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});

// Mostrar todos los datos
app.get('/', (req, res) => {
  connection.query('SELECT * FROM alumnos', (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    res.render('index', { datos: resultados });
  });
});

// Mostrar formulario para agregar nuevo dato
app.get('/agregar', (req, res) => {
  res.render('agregar');
});

// Agregar un nuevo dato
app.post('/', (req, res) => {
  const nuevoDato = req.body.nuevoDato;
  const consulta = 'INSERT INTO alumnos (columna1) VALUES (?)';

  if (!nuevoDato) {
    res.render('agregar', { error: 'El dato no puede estar vacío' });
    return;
  }

  connection.query(consulta, [nuevoDato], (error, results) => {
    if (error) {
      console.error('Error al insertar datos: ', error);
      return;
    }
    console.log('Dato insertado exitosamente');
    res.redirect('/');
  });
});

// Mostrar formulario para editar un dato existente
app.get('/editar/:id', (req, res) => {
  const id = req.params.id;
  const consulta = 'SELECT * FROM alumnos WHERE id = ?';

  connection.query(consulta, [id], (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    if (resultados.length === 0) {
      res.redirect('/');
      return;
    }
    res.render('editar', { dato: resultados[0] });
  });
});

// Mostrar datos filtrados con WHERE y JOIN
app.get('/filtrar', (req, res) => {
  const consulta = 'SELECT alumnos.columna1 AS nombre, alumnos.columna2 AS edad, alumnos.columna3 AS rol, peliculas.nombre AS nombre_pelicula, peliculas.tipo AS tipo_pelicula FROM alumnos JOIN peliculas ON alumnos.pelicula = peliculas.id';

  connection.query(consulta, (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    res.render('filtrar', { datos: resultados });
  });
});



// Actualizar un dato existente
app.post('/editar/:id', (req, res) => {
  const id = req.params.id;
  const nuevoDato = req.body.nuevoDato;
  const consulta = 'UPDATE alumnos SET columna1 = ? WHERE id = ?';

  if (!nuevoDato) {
    res.render('editar', { error: 'El dato no puede estar vacío' });
    return;
  }

  connection.query(consulta, [nuevoDato, id], (error, results) => {
    if (error) {
      console.error('Error al actualizar datos: ', error);
      return;
    }
    console.log('Dato actualizado exitosamente');
    res.redirect('/');
  });
});

// Eliminar un dato
app.get('/eliminar/:id', (req, res) => {
  const id = req.params.id;
  const consulta = 'DELETE FROM alumnos WHERE id = ?';

  connection.query(consulta, [id], (error, results) => {
    if (error) {
      console.error('Error al eliminar el dato: ', error);
      return;
    }
    console.log('Dato eliminado exitosamente');
    res.redirect('/');
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
