/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Adapter} from 'gateway-addon';
import {Shelly} from 'shellies';
import {MainPowerProperty} from './main-power-property';
import {PowerProperty} from './power-property';
import {ShellyDevice} from './shelly-device';

export class ShellyMeter extends ShellyDevice {
  constructor(adapter: Adapter, device: Shelly) {
    super(adapter, device);

    if (device.mode != 'roller') {
      console.log('Configuring power meters');

      const powerMeters: number[] = [];

      for (let i = 0; i < 4; i++) {
        const property = `power${i}`;

        if (device.hasOwnProperty(property)) {
          powerMeters.push(i);
        }
      }

      const multiple = powerMeters.length > 1;
      let mainPowerMeter: MainPowerProperty | undefined;

      if (multiple) {
        mainPowerMeter = new MainPowerProperty(this, 'power', 'Power all');
      }

      for (const i of powerMeters) {
        const property = `power${i}`;
        const powerProperty = new PowerProperty(
          this, `powerMeter${i}`, `Power ${i}`, !multiple, mainPowerMeter);
        this.addPropertyWithAlias(property, powerProperty);
      }
    } else {
      console.log('Ignoring power meters in roller mode');
    }
  }
}
