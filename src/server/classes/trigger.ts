import { Host } from './host';

export class Trigger {
    id: number;
    description: string;
    status: number;
    priority: number;
    lastchange: number;
    comments: string;
    hosts: Host[];
}