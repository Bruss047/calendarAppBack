const express = require('express');
require('dotenv').config(); // Configura las variables de entorno.
const {dbConnection} = require('./database/config');
const cors = require('cors');
const app = express();
const path = require('path');

//Base de Datos:
dbConnection();

//CORS:
app.use(cors());

//Directorio Público:
app.use(express.static('public')); // 'use' es un middleware.

//Lectura y Parse del Body:
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


app.get('*', ( req, res ) => {
    res.sendFile( path.join( __dirname+'/public/index.html' ) );
});

app.listen(process.env.PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})