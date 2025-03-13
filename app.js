const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop')

const app = express();

app.set('view engine', 'pug');
app.set('views','views');

app.use(bodyParser.urlencoded({ extended: true }));
//to access express filesystem folders & can register multiple path::
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminData.routes);
app.use(shopRoutes)

// app.use('/product', (req, res, next) => {
//     console.log(req.body)
//     res.redirect('/');
// })


app.use((req,res,next) => {
    //res.status(404).send('<h1>Page Not Found!</h1>')
    //res.status(404).sendFile(path.join(__dirname,'views','404.html'))
    res.status(404).render('404');
})

app.listen(3000);