const { create } = require('express-handlebars')
const path = require('path')
const flash = require('connect-flash')
const compression = require('compression')
const morgan = require('morgan')
const express = require('express')

// Connect create
const hbs = create({
    extname: 'hbs',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    }
})

module.exports = function (app) {
    require('./session')(app)

    // Logger
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('tiny'))
    }

    // HBS connect
    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, 'views'));

    // Middleware
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static(path.join(__dirname, 'public')))

    app.use(flash())
    app.use(compression())

    // Middlewares
    const authMiddleware = require('../middleware/auth')
    const userMiddleware = require('../middleware/user')
    const errorMiddleware = require('../middleware/error')

    // Require routes
    app.use(userMiddleware)
    const adminRouter = require('../routes/admin/admin')
    const authRoutes = require('../routes/admin/auth')

    // Routing
    app.use('/api/', authRoutes)

    app.use('/api/', authMiddleware, adminRouter)
    app.use(errorMiddleware)
}