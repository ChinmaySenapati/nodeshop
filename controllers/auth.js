exports.getLogin = (req, res, next) => {
// const isLoggedIn = req
//         .get('Cookie')
//         .split(';')[2]
//         .trim()
//         .split('=')[1] === 'true';
      res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
      });
};

exports.postLogin = (req, res, next) => {
    //res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=20');
    //res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    //res.setHeader('Set-Cookie', 'loggedIn=true; Secure');
    res.setHeader('Set-Cookie', 'loggedIn=true');
    res.redirect('/');
};