import * as Zabbix from 'zabbix-api';
import config from '../config';
import { Item } from '../classes/item';

export class ItemManager {
    private zabbix;
    
    constructor(){
        this.zabbix = new Zabbix(
            config.ZABBIX.API.AUTH.ZABBIX_USERNAME,
            config.ZABBIX.API.AUTH.ZABBIX_PASSWORD,
            config.ZABBIX.API.URL    
        );
    }
    
    public getItems(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zabbix.request('trigger.get', {
                "output": [
                    "hostid",
                    "name",
                    "status",
                    "description",
                    "lastvalue"
                ],
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
    

    public getUserLastLogin(): Promise<any> {
            
        return new Promise((resolve, reject) => {
            this.zabbix.request('item.get', {
                "output": [
                    "hostid",
                    "lastvalue"
                ],
                "filter": {
                    "name": "Current User Last Login Date"
                }
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    public getMacDirty(): Promise<any> {
            
        return new Promise((resolve, reject) => {
            this.zabbix.request('item.get', {
                "output": ['lastvalue', 'hostid'],
                "filter": {
                    "name": "Get IP Addresses"
                }
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    public getCurrentUsers(): Promise<any> {
            
        return new Promise((resolve, reject) => {
            this.zabbix.request('item.get', {
                "output": [
                    "hostid",
                    "lastvalue"
                ],
                "filter": {
                    "name": "Get Current User"
                }
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
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