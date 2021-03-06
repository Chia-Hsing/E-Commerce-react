const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
require('./db/mongoose')

const app = express()

// parse requests which the Content-Type is application/json
app.use(bodyParser.json())
// parse requests which the Content-Type is application/x-www-form-urlencoded. extended: true precises that the req.body object will contain values of any type instead of just strings.
app.use(bodyParser.urlencoded({ extended: true }))

const cors = require('cors')
app.use(cors())

require('./routers/index')(app)

/* There is also a built-in environment variable called NODE_ENV. When run npm start, it is always equal to 'development', when run npm test it is always equal to 'test', and when run npm run build to make a production bundle, it is always equal to 'production' */
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../client/build')))
    app.get(/.*/, (req, res) => {
        // res.sendFile() transfers the file at the given path and it sets the Content-Type response HTTP header field based on the filename extension.
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
    })
}

module.exports = app
