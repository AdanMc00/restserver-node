const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()

const bodyParser = require('body-parser');
require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

//Ruta Public
app.use(express.static(path.resolve(__dirname, '../public')));
//Configuracion global de rutas

app.use(require('./routes/index'))


mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
},(err, res) => {
     if (err) throw  err
    console.log('Base de datos online')
});
app.listen(process.env.PORT, () => {
    console.log('escuchando puerto: ', 3000)
})