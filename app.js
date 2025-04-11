require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const uri = process.env.MONGODB_URI;

const app = express();
const store = new MongoDBStore({
  uri: uri,
  collection: 'session' 
});

app.set('view engine', 'ejs');
app.set('views', 'views');

//registered routes here
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({ 
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
   })
);

app.use((req, res, next) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
});

app.use((req, res, next) => {
  User.findById('67f69a4826367ac89c3439db')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(uri)
.then(result =>{
  User.findOne().then(user => {
    if(!user) {
      const user = new User({
        name: 'chinmay',
        email: 'test@test.com',
        cart: {
          items: []
        }
      });
      user.save();
    }
  })
  console.log('connected!');
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});
