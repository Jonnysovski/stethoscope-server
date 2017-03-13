/// <reference path="./../../../typings/index.d.ts" />

import * as Zabbix from 'zabbix-api';
import config from '../config';
import { Trigger } from '../classes/trigger';
import { Item } from '../classes/item';
import * as Promise from 'bluebird';

export class TriggerManager {
    private zabbix;
    
    constructor(){
        this.zabbix = new Zabbix(
            config.ZABBIX.API.AUTH.ZABBIX_USERNAME,
            config.ZABBIX.API.AUTH.ZABBIX_PASSWORD,
            config.ZABBIX.API.URL    
        );
    }
    
    public getTriggers(): Promise<any> {
        let deferred = Promise.defer();
        this.zabbix.request('trigger.get', {
            "output": ["description", "status", "priority", "lastchange", "comments"],
            "selectGroups": ["name", "internal"],
            "selectHosts": ["host", "available", "name"],
            "withLastEventUnacknowledged": 1,
            "expandDescription": "1",
            "filter": {
                "value": "1"
            },
            "sortfield": "priority",
            "sortorder": "DESC"
        }, (err, triggers: Trigger[]) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(triggers);
            }
        });

        return deferred.promise;
    }
}