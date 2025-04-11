const User = require('../models/user');

exports.getLogin = (req, res, next) => {
// const isLoggedIn = req
//         .get('Cookie')
//         .split(';')[2]
//         .trim()
//         .split('=')[1] === 'true';
console.log(req.session.isLoggedIn);
      res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
      });
};

exports.postLogin = (req, res, next) => {
  User.findById('67f69a4826367ac89c3439db')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {  //must need - once the session is created successfully in mongoDB then only redirect to main page.
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};