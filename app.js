const express = require ('express')
const morgan = require ('morgan')
const mongoose = require ('mongoose')
const dbConnection = require('./src/config/db')
require ('dotenv').config()
const router = require('./src/routes/user.routes')
const app = express ()
const port = process.env.PORT || 3000

app.use (express.json())
app.use (morgan ('dev'))


app.get ('/', (req, res) => {
    res.send ('Welcome')
});


app.use ('/api/user', router)

app.listen (port, () => {
    dbConnection()
    console.log (`app listening on http://localhost:${port}`)
});