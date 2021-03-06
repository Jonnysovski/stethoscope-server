
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as methodOverride from 'method-override';
import * as mongoose from 'mongoose';
import { Scheduler } from './scheduler/scheduler';
import * as triggerRouter from './controllers/trigger.controller';
import * as hostRouter from './controllers/host.controller';
import * as itemRouter from './controllers/item.controller';

// var config = require('./../../config');
const app: express.Application = express();
// mongoose.connect(config.db.prod.url);
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
const port: number = 3000;
app.use('/api', triggerRouter);
app.use('/api/host', hostRouter);
app.use('/api/item', itemRouter);
var server = app.listen(port, () => {
    console.log('Application is running port %s', port);
    Scheduler.updateTriggers();
});