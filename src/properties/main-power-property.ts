/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Property, Device} from 'gateway-addon';

export class MainPowerProperty extends Property<number> {
    private powerValues: { [key: string]: number } = {};

    constructor(device: Device, name: string, title: string) {
      super(device, name, {
        '@type': 'InstantaneousPowerProperty',
        type: 'number',
        unit: 'watt',
        title,
        readOnly: true,
      });
    }

    public setPowerValue(meter: string, value: number): void {
      this.powerValues[meter] = value;
      const sum = Object.values(this.powerValues)
        .reduce((acc, i) => acc + i, 0);
      this.setCachedValueAndNotify(sum);
    }
}
