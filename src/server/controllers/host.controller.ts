import * as express from 'express';
import { HostManager } from './../managers/host.manager';
import { Host } from './../classes/host';

let router: express.Router = express.Router();
let hostManager = new HostManager();

router.get('/count', (req:express.Request, res:express.Response) => {
    hostManager.count().then( num => {
        return res.json(num);
    }).catch( err => {
        console.log(err);
        return res.sendStatus(500);
    })
});

export = router;