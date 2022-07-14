const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if (!req.session.authen) {
        res.redirect('/api/login')
        return
    }

    try {
        const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET_KEY)

        res.locals.id = decoded.id
        next()
    } catch (error) {
        console.log(error.message);
        req.flash('error', error.message)
        return res.redirect('/api/login')
    }
}