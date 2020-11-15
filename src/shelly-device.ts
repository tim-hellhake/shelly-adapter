/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Device, Property } from 'gateway-addon';
import { Shelly } from 'shellies';
import { TemperatureProperty } from './temperature-property';

export class ShellyDevice extends Device {
    private callbacks: { [key: string]: () => void } = {};
    private shellyProperties: { [key: string]: Property } = {};

    constructor(adapter: any, device: Shelly) {
        super(adapter, device.id);
        this['@context'] = 'https://iot.mozilla.org/schemas/';
        this['@type'] = [];
        this.name = `${device.constructor.name} (${device.id})`;

        device.on('change', (prop: any, newValue: any, oldValue: any) => {
            console.log(`${device.id} ${prop} changed from ${oldValue} to ${newValue}`);
            const property = this.shellyProperties[prop];
            if (property) {
                property.setCachedValueAndNotify(newValue);
            } else {
                console.warn(`No property for ${prop} found`);
            }
        });

        if (device.deviceTemperature) {
            console.log(`Detected deviceTemperature property`);
            const property = new TemperatureProperty(this, 'internalTemperature', 'Device temperature');
            this.addProperty('deviceTemperature', property);
        }
    }

    protected addProperty(shellyProperty: string, property: Property) {
        this.properties.set(property.name, property);
        this.shellyProperties[shellyProperty] = property;
    }

    protected addCallbackAction(name: string, description: any, callback: () => void) {
        this.addAction(name, description);
        this.callbacks[name] = callback;
    }

    async performAction(action: any) {
        action.start();

        const callback = this.callbacks[action.name];

        if (callback != undefined) {
            console.log(`Executing action ${action.name}`);
            callback();
        } else {
            console.warn(`Unknown action ${action.name}`);
        }

        action.finish();
    }
}
