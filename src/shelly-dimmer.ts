/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Shelly } from 'shellies';
import { SwitchProperty } from './switch-property';
import { BrightnessProperty } from './brightness-property';
import { ShellyMeter } from './shelly-meter';

export class ShellyDimmer extends ShellyMeter {
    private switchProperty: SwitchProperty;
    private brightnessProperty: BrightnessProperty;

    constructor(adapter: any, device: Shelly) {
        super(adapter, device);
        this['@context'] = 'https://iot.mozilla.org/schemas/';
        this['@type'].push('Light');

        this.switchProperty = new SwitchProperty(this, 'switch', 'Switch', true, (value) => {
            console.log(`setWhite(${this.brightnessProperty.value}, ${value})`);
            device.setWhite(this.brightnessProperty.value, value);
        });

        this.addProperty('switch', this.switchProperty);

        this.brightnessProperty = new BrightnessProperty(this, 'brightness', (value) => {
            console.log(`setWhite(${value}, ${this.switchProperty.value})`);
            device.setWhite(value, this.switchProperty.value);
        });

        this.addProperty('brightness', this.brightnessProperty);
    }
}
