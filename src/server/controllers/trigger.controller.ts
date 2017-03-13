/// <reference path="./../../../typings/index.d.ts" />

import * as express from 'express';
import { TriggerManager } from './../managers/trigger.manager';
import { Trigger } from './../classes/trigger';

let router: express.Router = express.Router();
let triggerManager = new TriggerManager();

router.get('/trigger', (req:express.Request, res:express.Response) => {
    triggerManager.getTriggers().then((triggers) => {
        return res.json(triggers);
    }).catch((err) => {
        console.log(err);
        return res.sendStatus(500);
    });
});

export = router;