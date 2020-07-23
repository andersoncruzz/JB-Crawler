const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./src/api');
const errorHandler = require('./src/error');

const server = express();
server.use(bodyParser.json());
server.use(cors());
server.use('/rest', api);
server.use(errorHandler);
module.exports = server;
