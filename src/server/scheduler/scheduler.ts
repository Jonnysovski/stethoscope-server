import * as nodeSchedule from 'node-schedule';
// import { TriggerScheduler } from './trigger';
import { TriggerManager } from '../managers/trigger.manager';

var triggerManager = new TriggerManager();

export class Scheduler {
    public static updateTriggers() {
        nodeSchedule.scheduleJob('*/10 * * * * *', () => {
            triggerManager.getTriggers().then(triggers => {
                // console.log(triggers);
            }, error => {
                console.error(error);
            });
        });
    }


}