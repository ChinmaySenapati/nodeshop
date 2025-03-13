const path = require('path');
const express = require('express');

const router = express.Router();
const products = [];

router.get('/add-product', (req,res,next) => {
    console.log('<h1>This is from "add products" page</h1>');
    res.render('add-product', {pageTitle: "Add Product", path: '/admin/add-product', activeAddProduct: true, productCSS: true, formCSS: true})
})

router.post('/add-product', (req, res, next) => {
    console.log(req.body)
    products.push({ title: req.body.title })
    res.redirect('/');
})

exports.routes = router;
exports.products = products;