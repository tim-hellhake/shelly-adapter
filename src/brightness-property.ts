/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Property } from 'gateway-addon';
import { ShellyDevice } from './shelly-device';

export class BrightnessProperty extends Property {
    constructor(device: ShellyDevice, name: string, private onChange: (value: number) => void) {
        super(device, name, {
            type: 'number',
            '@type': 'BrightnessProperty',
            title: 'brightness',
            description: 'The brightness of the dimmer'
        });
        device.properties.set(name, this);
    }
    async setValue(value: any): Promise<void> {
        super.setValue(value);
        this.onChange(value);
    }
}
