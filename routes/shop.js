const path = require('path');
const express = require('express');

const rootDir = require('../util/path')

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('Its always run')
    //res.send('<h1>This always run</h1>')
    res.sendFile(path.join(rootDir, 'views', 'shop.html'))
});

module.exports = router;