module.exports = {
    async home(req, res) {
        // res.set('auth-token', res.headers('auth-token'))
        res.render('admin/index', {
            title: 'Home page',
            layout: '../admin/layouts/main',
        })
    }
}