const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
MongoClient.connect('mongodb+srv://chinmays:EvhBfpV8JX2Lylev@cluster0.bcmob3z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(client => {
        console.log("Connected!");
        callback(client);
    })
    .catch(err => console.log(err));
}

module.exports = mongoConnect;