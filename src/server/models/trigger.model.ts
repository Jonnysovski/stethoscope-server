import * as mongoose from 'mongoose';
import { ITrigger } from './../classes/trigger';

var triggerSchema: mongoose.Schema = new mongoose.Schema({
    
});

var TriggerModel = mongoose.model<ITrigger>("Trigger", triggerSchema);

export = TriggerModel;