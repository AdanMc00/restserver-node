const express = require('express')
const app = express()
const bodyParser= require('body-parser');
require('config/config');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.json('Hello World')
})
app.post('/usuario', function (req, res) {
    let body = req.body
    res.json({body})
})

app.listen(proccess.env.PORT, ()=> {
    console.log('escuchando puerto: ', 3000)
})