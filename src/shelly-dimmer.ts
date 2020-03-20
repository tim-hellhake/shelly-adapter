/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Device } from 'gateway-addon';
import { Shelly } from 'shellies';
import { SwitchProperty } from './switch-property';
import { BrightnessProperty } from './brightness-property';

export class ShellyDimmer extends Device {
    private switchProperty: SwitchProperty;
    private brightnessProperty: BrightnessProperty;
    constructor(adapter: any, device: Shelly) {
        super(adapter, device.id);
        this['@context'] = 'https://iot.mozilla.org/schemas/';
        this['@type'] = ['Light'];
        this.name = `${device.constructor.name} (${device.id})`;
        this.switchProperty = new SwitchProperty(this, 'switch', (value) => {
            console.log(`setWhite(${this.brightnessProperty.value}, ${value})`);
            device.setWhite(this.brightnessProperty.value, value);
        });
        this.brightnessProperty = new BrightnessProperty(this, 'brightness', (value) => {
            console.log(`setWhite(${value}, ${this.switchProperty.value})`);
            device.setWhite(value, this.switchProperty.value);
        });
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
    }
}
