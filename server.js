const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://192.168.99.100:27017/zalo', {useMongoClient: true}, (err) => {
    if (err) throw err;
});

const PORT = process.env.PORT || 8080;

const whitelist = process.env.WHITELIST ? process.env.WHITELIST.split(',') : true;
const corsOptions = {
    origin: Array.isArray(whitelist) ? ((origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }) : true
};

app.use(express.static('asset'));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    type: '*/*'
}));

/* Routes */
app.use('/', require('./controller'));

app.listen(PORT);
console.log('Server is runing on port: ' + PORT);
module.exports = app;
