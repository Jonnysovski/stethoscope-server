"use strict";
/// <reference path="./../../typings/index.d.ts" />
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
// import * as requestRouter from './controllers/request.controller';
// import * as userRouter from './controllers/user.controller';
var config = require('./../../config');
var app = express();
bluebird.promisifyAll(mongoose);
mongoose.connect(config.db.prod.url);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(morgan('dev'));
// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Pass to next layer of middleware
    next();
});
var port = 80;
// app.use('/api/', requestRouter);
// app.use('/api/', userRouter);
var server = app.listen(port, function () {
    console.log('Application is running port %s', port);
});

//# sourceMappingURL=../../build/server/server.js.map
