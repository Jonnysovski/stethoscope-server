import * as Zabbix from 'zabbix-api';
import config from '../config';
import { Trigger } from '../classes/trigger';
import { Item } from '../classes/item';
import * as Promise from 'bluebird';

export class TriggerScheduler {

    private static ZBX = new Zabbix(config.ZABBIX.API.AUTH.ZABBIX_USERNAME,
        config.ZABBIX.API.AUTH.ZABBIX_PASSWORD,
        config.ZABBIX.API.URL);

    public static getTriggers() {
        let deferred = Promise.defer();

        TriggerScheduler.ZBX.request('trigger.get', {
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

    public static getItem(key: string, hostId: number) {
        let deferred = Promise.defer();

        TriggerScheduler.ZBX.request('item.get', {
            "output": [
                "hostid",
                "name",
                "key_",
                "status",
                "description",
                "lastvalue"
            ],
            "hostids": hostId,
            "search": {
                "key_": key
            }
        }, (err, items: Item[]) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(items);
            }
        });

        return deferred.promise;
    }
}