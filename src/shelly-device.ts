/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Device } from 'gateway-addon';
import { Shelly } from 'shellies';
import { SwitchProperty } from './switch-property';
import { TemperatureProperty } from './temperature-property';

export class ShellyDevice extends Device {
    constructor(adapter: any, device: Shelly) {
        super(adapter, device.id);
        this['@context'] = 'https://iot.mozilla.org/schemas/';
        this['@type'] = ['SmartPlug'];
        this.name = `${device.constructor.name} (${device.id})`;
        new SwitchProperty(this, 'relay0', (value) => device.setRelay(0, value));
        device.on('change', (prop: any, newValue: any, oldValue: any) => {
            console.log(`${prop} changed from ${oldValue} to ${newValue}`);
            const property = this.properties.get(prop);
            if (property) {
                property.setCachedValueAndNotify(newValue);
            }
            else {
                console.warn(`No property for ${prop} found`);
            }
        });

        if (device.internalTemperature) {
            console.log(`Detected internalTemperature property`);
            new TemperatureProperty(this, 'internalTemperature');
        }
    }
}
