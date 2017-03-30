import * as Zabbix from 'zabbix-api';
import config from '../config';
import { ITrigger } from '../classes/trigger';
import { Item } from '../classes/item';

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
        return new Promise((resolve, reject) => {
            this.zabbix.request('trigger.get', {
                "output": ["description", "status", "priority", "lastchange", "comments"],
                "selectGroups": ["name", "internal"],
                "selectTags": "extend",
                "selectHosts": ["host", "available", "name"],
                "withLastEventUnacknowledged": 1,
                "expandDescription": "1",
                "filter": {
                    "value": "1"
                },
                "sortfield": "priority",
                "sortorder": "DESC"
            }, (err, triggers: ITrigger[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(triggers);
                }
            });
        });
    }

    public getSevereNum(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.zabbix.request('trigger.get', {
                'output': 'extend',
                'countOutput': true,
                "withLastEventUnacknowledged": 1,
                "filter": {
                    "priority": ["4","5"],
                    'value': '1'
                }
            }, (err, triggers: ITrigger[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(triggers);
                }
            });
        });
    }

    public joinTriggerUser(triggers, users, lastLogins) {
      for(let trigger of triggers) {
            let hostId = trigger.hosts[0].hostid;
            trigger.currentUser = getValueByHostHelper(hostId, users);
            let lastLogin =  getValueByHostHelper(hostId, lastLogins);
            if(lastLogin == "0"){
                // lastLogin = new Date(0);
                lastLogin = "---";
            } 
            trigger.lastLogin = lastLogin;
            let type = "---";
            for (let tag of trigger.tags) {
                if (tag.tag == "Type"){
                    type = tag.value;
                    break;
                }
            }
            trigger.type = type;
        }
        return triggers;
    }
    
}

function getValueByHostHelper(hostId, matrix) {
    for(let item of matrix) {
        if(item.hostid == hostId) {
            return item.lastvalue;
        }
    }
    return "---";
}

function normalizeData(data) {
    return  JSON.parse(JSON.stringify(data));
}