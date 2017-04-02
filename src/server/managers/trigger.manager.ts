import * as Zabbix from 'zabbix-api';
import config from '../config';
import { ITrigger } from '../classes/trigger';
import { Item } from '../classes/item';
import { Fault } from '../classes/fault';
import { ItemManager } from './../managers/item.manager';
import { HostManager } from './../managers/host.manager';


export class TriggerManager {
    private zabbix;
    private _itemManager = new ItemManager();
    private _hostManager = new HostManager();

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
                "selectHosts": ["host", "available", "name", "ip"],
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

    private filterByField( filterVal: string, getObjField: Function,  faults: Fault[]): Fault[] {
        // if(!filteredValue || filteredValue == '') return faults;
        if(!filterVal || filterVal == 'undefined'){
            return faults;
        } 
        let filtered: Fault[] = [];
        for (let fault of faults) {
            if( isSubstringWeak(getObjField(fault),filterVal) ) {
                filtered.push(fault);
            }
        }
        return filtered;
    }

    public getFaults(): Promise<Fault[]> {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getTriggers(), 
                this._itemManager.getCurrentUsers(),
                this._itemManager.getUserLastLogin(),
                this._hostManager.getIp()
            ]).then(vals => {
                let faults: Fault[] = this.completeFaultData(vals[0], vals[1], vals[2], vals[3]);
                resolve(faults);
            }).catch( reason => {
                reject(reason);
            });
        })
    }

    public getFilteredFaults( filter ) {
        return new Promise((resolve, reject) => {
            this.getFaults().then( (faults) => {
                let filteredFaults = [];
                resolve(this.filterByField(filter.hostName, (fault)=>{return fault.host.name}, 
                            this.filterByField(filter.ip, (fault)=>{return fault.ip}, 
                                this.filterByField( filter.userName, (fault) => { return fault.currentUser}, faults) )));
            }).catch( reason => reject(reason));
        })
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

    public completeFaultData(triggers, users, lastLogins, ips): Fault[] {
        let faults: Fault[] = [];

        for(let trigger of triggers) {
            let host = {
                id: trigger.hosts[0].hostid,
                name: trigger.hosts[0].host
            }
            let currentUser = getValueByHostHelper(host.id, users);
            let lastLogin =  getValueByHostHelper(host.id, lastLogins);
            let ip =  getIpByHostHelper(host.id, ips);
            if(lastLogin == "0") lastLogin = "---";
            let type = "---";
            for (let tag of trigger.tags) {
                if (tag.tag == "Type"){
                    type = tag.value;
                    break;
                }
            }

            let fault = new Fault(
                trigger.triggerid,
                trigger.description,
                trigger.status,
                trigger.priority,
                trigger.lastchange,
                host,
                currentUser,
                lastLogin,
                type,
                ip
            );
            faults.push(fault);
        }
        return faults;
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

function getIpByHostHelper(hostId, matrix) {
    for(let item of matrix) {
        if(item.hostid == hostId) {
            return item.ip;
        }
    }
    return "---";
}

function normalizeData(data) {
    return  JSON.parse(JSON.stringify(data));
}

function isSubstringWeak(str: string, sub: string) {
    return str.toLowerCase().includes(sub.toLowerCase());
}