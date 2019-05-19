const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

/* Application root folder */
global.appRoot = path.resolve(__dirname)
const router = require('./routes/router')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* Serve static */
app.use(express.static(path.join(global.appRoot, 'assets')))

router(app)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
