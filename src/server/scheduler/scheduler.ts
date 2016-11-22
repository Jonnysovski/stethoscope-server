/// <reference path="./../../../typings/index.d.ts" />

import * as nodeSchedule from 'node-schedule';
import * as Promise from 'bluebird';
import { TriggerScheduler } from './trigger';

export class Scheduler {
    public static updateTriggers() {
        nodeSchedule.scheduleJob('*/10 * * * * *', () => {
            TriggerScheduler.getTriggers().then(triggers => {
                console.log(triggers);
            }, error => {
                console.error(error);
            });
        });
    }


}