const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

const bookRouter = require('./router/book_router');
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(bookRouter);

module.exports = app;

