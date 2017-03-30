import * as express from 'express';
import { ItemManager } from './../managers/item.manager';
import { Item } from './../classes/item';

let router: express.Router = express.Router();
let itemManager = new ItemManager();


router.get('/', (req:express.Request, res:express.Response) => {
    itemManager.getItems().then((items) => {
        return res.json(items);
    }).catch((err) => {
        console.log(err);
        return res.sendStatus(500);
    });
});

router.get('/users', (req:express.Request, res:express.Response) => {
    itemManager.getCurrentUsers().then( users => {
        return res.json(users);
    }).catch( err => {
        console.log(err);
        return res.sendStatus(500);
    })
})

router.get('/users/lastlogin', (req:express.Request, res:express.Response) => {
    itemManager.getUserLastLogin().then( logins => {
        return res.json(logins);
    }).catch( err => {
        console.log(err);
        return res.sendStatus(500);
    })
})

export = router;