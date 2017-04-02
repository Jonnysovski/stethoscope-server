import * as express from 'express';
import { TriggerManager } from './../managers/trigger.manager';
import { ItemManager } from './../managers/item.manager';

import { ITrigger } from './../classes/trigger';

let router: express.Router = express.Router();
let triggerManager = new TriggerManager();
let itemManager = new ItemManager();

router.get('/trigger', (req:express.Request, res:express.Response) => {
    triggerManager.getTriggers().then((triggers) => {
        return res.json(triggers);
    }).catch((err) => {
        console.log(err);
        return res.sendStatus(500);
    });
});

router.get('/trigger/count', (req:express.Request, res:express.Response) => {
    triggerManager.getSevereNum().then( num => {
        return res.json(num);
    }).catch( err => {
        console.log(err);
        return res.sendStatus(500);
    })
});

router.get('/test', (req:express.Request, res:express.Response) => {
    Promise.all([
        triggerManager.getTriggers(), 
        itemManager.getCurrentUsers(),
        itemManager.getUserLastLogin()
    ]).then(vals => {
        console.log("There are " + vals.length);
        let triggers = triggerManager.completeFaultData(vals[0], vals[1], vals[2], vals[3]);
        return res.json(triggers);
    }).catch( reason => {
        console.log(reason);
        return res.sendStatus(500);
    });
});

router.get('/faults', (req:express.Request, res:express.Response) => {
    triggerManager.getFaults().then( faults => {
        return res.json(faults);
    }).catch( err => {
        console.log(err);
        return res.sendStatus(500);
    });
});

router.get('/faults/filter/:filter', (req:express.Request, res:express.Response) => {
    let filter = JSON.parse(req.params.filter);
    triggerManager.getFilteredFaults({hostName: filter.hostName, userName: filter.userName, ip: filter.ip}).then( faults => {
        return res.json(faults);
    }).catch( err => {
        console.log(err);
        return res.sendStatus(500);
    });
});

export = router;