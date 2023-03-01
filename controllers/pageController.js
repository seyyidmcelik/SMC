const indexPage = (req, res) => {
    res.render('index', {
        link: 'index'
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
    res.cookie('to', '', {
        maxAge: 1
    })
    res.redirect('/')
}

const register = (req, res) => {
    res.render('register', {
        link: 'register'
    })
}

export { indexPage, login, register, logout }