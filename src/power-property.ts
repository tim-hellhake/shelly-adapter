/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Property, Device } from 'gateway-addon';
import { MainPowerProperty } from './main-power-property';

export class PowerProperty extends Property {
    constructor(device: Device, name: string, title: string, primary: boolean, private mainPowerMeter?: MainPowerProperty) {
        super(device, name, {
            '@type': primary ? 'InstantaneousPowerProperty' : undefined,
            type: 'number',
            unit: 'watt',
            title,
            readOnly: true
        });

        device.properties.set(name, this);
    }

    public setCachedValueAndNotify(value: any) {
        super.setCachedValueAndNotify(value);

        if (this.mainPowerMeter) {
            this.mainPowerMeter.setPowerValue(this.name, value);
        }
    }
}
