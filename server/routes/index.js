const express = require('express')

const app = express()


app.use(require('./user'))
app.use(require('./categoria'))
app.use(require('./productos'))
app.use(require('./login'))

module.exports = app;