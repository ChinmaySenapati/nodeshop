//const http = require('http');
//const fs = require('fs');

const express = require('express');

const app = express();
// app.use((req,res,next) =>{
//     console.log( "This is middleware!!");
//     next(); //allow the request to continue to the next middleware in line
// });

app.use('/',(req,res,next) =>{
    console.log( "This always run..!!");
   next(); //allow the request to continue to the next
});

app.use('/add-product',(req,res,next) =>{
    console.log( "This is add product middleware..!!");
    res.send('<h1>This is fm "add-product" page!</h1>');
});

app.use('/',(req,res,next) =>{
    console.log( "This is 2nd middleware..!!");
    res.send('<h1>This is fm Expressjs!</h1>');
});

app.listen(3000)

//let server = http.createServer(app);

//const routes = require('./routes');
//let server = http.createServer(routes);
//console.log(routes.someText);
//let server = http.createServer(routes.handler);

// let server = http.createServer((req, res) => {
    //console.log(req.url, req.method, req.headers);
    // const url = req.url;
    // const method = req.method;
    // if(url === '/') {
    //     res.write('<html>');
    //     res.write('<head><title> Enter message!</title></head>');
    //     res.write('<body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">send</button></form></body>');
    //     res.write('</html>');
    //     return res.end();
    //     }
    
    //     if(url === '/message' && req.method === 'POST') {
    //         const body = [];
    //         req.on('data', (chunk) => {
    //             console.log(chunk)
    //             body.push(chunk)
    //         });
    //        return req.on('end', () => {
    //             const parseBody = Buffer.concat(body).toString();
    //             console.log(parseBody);
    //             const message = parseBody.split("=")[1];
    //             console.log(message);
    //             //fs.writeFileSync('output.txt', message);
    //             fs.writeFile('output.txt', message, err =>{
    //                 res.statusCode = 302;
    //                 res.setHeader('Location', '/');
    //                 return res.end();
    //             });
    //         });
    //     }
    //     res.setHeader('Content-Type', 'text/html' );
    //     res.write('<html>');
    //     res.write('<head><title> my page</title></head>');
    //     res.write('<body><h1>This is node server!</h1></body>');
    //     res.write('</html>');
    //     res.end();
//});

//server.listen(3000);