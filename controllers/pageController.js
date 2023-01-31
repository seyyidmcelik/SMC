const indexPage = (req, res) => {
    res.render('index', { link: 'index' })
}

const gallery = (req, res) => {
    res.render('gallery', {
        link: 'gallery'
    })
}

const login = (req, res) => {
    res.render('login', {
        link: 'login'
    })
}

const logout = (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 1
    })
    res.redirect('/')
}

const register = (req, res) => {
    res.render('register', {
        link: 'register'
    })
}

export { indexPage, gallery, login, register, logout }