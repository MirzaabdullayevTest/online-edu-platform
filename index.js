const express = require('express')
const app = express()
const { create } = require('express-handlebars')
const path = require('path')
const morgan = require('morgan')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')
const compression = require('compression')

// dotenv connecting
require('dotenv').config()

// Middlewares
const authMiddleware = require('./middleware/auth')
const userMiddleware = require('./middleware/user')
const errorMiddleware = require('./middleware/error')

// Require routes
const adminRouter = require('./routes/admin/admin')
const authRoutes = require('./routes/admin/auth')

// Connect create
const hbs = create({
    extname: 'hbs',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    }
})

// MongoDB connect
require('./helper/db')(process.env.MONGO_URI)
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'mySession',
    expires: 1000 * 60 // ms
})

// HBS connect
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(flash())
app.use(compression())

// Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'))
}

app.use(userMiddleware)

// Routing
app.use('/api/', authRoutes)

app.use('/api/', authMiddleware, adminRouter)
app.use(errorMiddleware)

const port = normalizePort(process.env.port || '5000')
app.set('port', port)

try {
    app.listen(port, () => {
        console.log(`Server listening on port: `, app.get('port'));
    })
} catch (error) {
    console.log(error);
    process.exit(0)
}

function normalizePort(val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }

    if (port > 0) {
        return port
    }

    return false
}