const express = require('express')
const app = express()

// dotenv connecting
require('dotenv').config()

require('./start/routes')(app)
require('./helper/db')(process.env.MONGO_URI)

const port = require('./utils/normalizePort')(process.env.PORT || '5000')
app.set('port', port)

try {
    app.listen(port, () => {
        console.log(`Server listening on port: `, app.get('port'));
    })
} catch (error) {
    console.log(error);
    process.exit(0)
}