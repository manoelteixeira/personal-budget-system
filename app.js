// app.js
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');


const app = express();
const PORT = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(errorHandler());
app.use(cors());
app.use(morgan('dev'));

const apiRouter = require('./src/routes/api.js');
app.use('/', apiRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});

module.exports = app;