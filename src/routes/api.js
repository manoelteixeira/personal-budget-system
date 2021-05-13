// src/api/api.js

const express = require('express');
const apiRouter = express.Router();

const envelopesRouter = require('./envelopes');
apiRouter.use('/envelopes', envelopesRouter);

apiRouter.get('/', (req, res) => {
    res.status(200).send("Hello World!");
});


module.exports = apiRouter;