
const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config')
const app = express();
const cors = require('cors');

//App use Cors
app.use(cors());

app.use(express.json());

//Base de Datos
dbConnection();

app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/login', require('./routes/auth'))




app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puertos ' + process.env.PORT);

});