const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
if(url === '/') {
    res.write('<html>');
    res.write('<head><title> Enter message!</title></head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">send</button></form></body>');
    res.write('</html>');
    return res.end();
    }

    if(url === '/message' && req.method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk)
            body.push(chunk)
        });
       return req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            console.log(parseBody);
            const message = parseBody.split("=")[1];
            console.log(message);
            //fs.writeFileSync('output.txt', message);
            fs.writeFile('output.txt', message, err =>{
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
    res.setHeader('Content-Type', 'text/html' );
    res.write('<html>');
    res.write('<head><title> my page</title></head>');
    res.write('<body><h1>This is node server!</h1></body>');
    res.write('</html>');
    res.end();
};

module.exports = requestHandler;

// module.exports = {
//     handler: requestHandler,
//     someText: "some text"
// };


// module.exports.handler = requestHandler;
// module.exports.someText="some text";

// exports.handler = requestHandler;
// exports.someText="some text";