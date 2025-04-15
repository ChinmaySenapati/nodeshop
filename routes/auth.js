const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post(
    '/signup', [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
            throw new Error('Email already exists. Please choose a different email address.');
        }
    }), 
    body(
        'password', 
        'Please enter a password with only numbers & text and Password must be at least 5 characters long.'
    )
    .isLength({ min: 5 })
    .isAlphanumeric(),
    //body('confirmPassword')
],
authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
