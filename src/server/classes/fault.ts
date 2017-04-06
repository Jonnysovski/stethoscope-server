import { Host } from './host';
import * as mongoose from 'mongoose';

// TODO: Ask Ron about the document extend

export class Fault{
    id: number;
    description: string;
    status: number;
    priority: number;
    lastchange: number;
    host: any;
    currentUser: string;
    lastConnection: string;
    type:string;
    ip :string;
    mac: string;

    constructor(
        id: number,
        description: string,
        status: number,
        priority: number,
        lastchange: number,
        host: any,
        currentUser: string,
        lastConnection: string,
        type:string,
        ip :string,
        mac: string
    ) {
        this.id = id;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.lastchange = lastchange;
        this.host = host;
        this.currentUser = currentUser;
        this.lastConnection = lastConnection;
        this.type = type;
        this.ip = ip;
        this.mac = mac;
    }
}