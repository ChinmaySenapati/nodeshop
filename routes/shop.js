const path = require('path');
const express = require('express');

const rootDir = require('../util/path')
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    //console.log('This always run!');
    console.log('shop.js', adminData.products);
    //res.send('<h1>This always run</h1>')
    //res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    const products = adminData.products;
    res.render('shop', { prods: products, docTitle: 'Shop' });
});

module.exports = router;