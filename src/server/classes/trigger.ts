import { Host } from './host';
import * as mongoose from 'mongoose';

// TODO: Ask Ron about the document extend

export interface ITrigger extends mongoose.Document{
    id: number;
    description: string;
    status: number;
    priority: number;
    lastchange: number;
    comments: string;
    hosts: Host[];
}