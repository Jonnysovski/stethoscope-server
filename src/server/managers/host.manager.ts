import * as Zabbix from 'zabbix-api';
import config from '../config';
import { Host } from '../classes/host';

export class HostManager {
    private zabbix;
    
    constructor(){
        this.zabbix = new Zabbix(
            config.ZABBIX.API.AUTH.ZABBIX_USERNAME,
            config.ZABBIX.API.AUTH.ZABBIX_PASSWORD,
            config.ZABBIX.API.URL    
        );
    }

    public count(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zabbix.request('host.get', {
                "countOutput": true
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    public getIp(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zabbix.request('hostinterface.get', {
                "output": ["hostid", "ip"]
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
