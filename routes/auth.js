const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login',
    [
      body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.'),
      body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
    ],
    authController.postLogin
  );

router.post(
    '/signup', [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .custom(async (value, { req }) => {
        // 1st way of checking email uniqueness
        // if (value === 'test2@test.com') {
        //     throw new Error('Email is not allowed. Please choose a different email address.');
        // }
        // return true;

        // 2nd way of checking email uniqueness
        // const user = await User.findOne({ email: value });
        // if (user) {
        //     throw new Error('Email already exists. Please choose a different email address.');
        // }

        // 3rd way of checking email uniqueness using MongoDB
        return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email already exists. Please choose a different email address.');
            }
        });
    }), 
    body(
        'password', 
        'Please enter a password with only numbers & text and Password must be at least 5 characters long.'
    )
    .isLength({ min: 5 })
    .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match.');
        }
        return true;
    })
],
authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
