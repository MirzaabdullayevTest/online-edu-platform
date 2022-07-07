const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if (!req.session.authen) {
        res.redirect('/api/login')
        return
    }

    // const id = jwt.verify(req.header('auth-token'), process.env.JWT_SECRET_KEY)
    // console.log(id);
    // res.locals.id = id

    next()
}