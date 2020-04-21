/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Property, Device } from 'gateway-addon';

export class RollerPositionProperty extends Property {
    constructor(device: Device, name: string, title: string, private onChange: (value: number) => void) {
        super(device, name, {
            type: 'number',
            '@type': 'LevelProperty',
            title: title,
            description: 'The roller shutter position in percent'
        });
        device.properties.set(name, this);
    }

    async setValue(value: any): Promise<void> {
        super.setValue(value);
        this.onChange(value);
    }
}
