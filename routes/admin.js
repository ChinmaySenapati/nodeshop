const path = require('path');

const express = require('express');
const { check, body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
    body('title')
       .isString()
        .isLength({ min: 3 })
        .trim()
        .notEmpty()
        .withMessage('Title must not be empty'),
    body('price')
       .isFloat()
       .withMessage('Price must be a number'),
    body('description')
       .notEmpty()
       .withMessage('Description must not be empty')
       .isLength({ min: 5, max: 500 })
       .trim()
], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
    body('title')
       .isString()
       .isLength({ min: 3 })
       .trim()
       .notEmpty()
       .withMessage('Title must not be empty'),
    body('price')
       .isFloat()
       .withMessage('Price must be a number'),
    body('description')
       .notEmpty()
       .withMessage('Description must not be empty')
       .isLength({ min: 5, max: 500 })
       .trim()
], isAuth, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
