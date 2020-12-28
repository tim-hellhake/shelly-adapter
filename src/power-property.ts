/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Property, Device} from 'gateway-addon';
import {MainPowerProperty} from './main-power-property';

export class PowerProperty extends Property<number> {
  constructor(device: Device, name: string, title: string, primary: boolean,
    // eslint-disable-next-line no-unused-vars
    private mainPowerMeter?: MainPowerProperty) {
    super(device, name, {
      // eslint-disable-next-line no-undefined
      '@type': primary ? 'InstantaneousPowerProperty' : undefined,
      type: 'number',
      unit: 'watt',
      title,
      readOnly: true,
    });
  }

  public setCachedValueAndNotify(value: number): boolean {
    const changed = super.setCachedValueAndNotify(value);

    if (this.mainPowerMeter) {
      this.mainPowerMeter.setPowerValue(this.getName(), value);
    }

    return changed;
  }
}
