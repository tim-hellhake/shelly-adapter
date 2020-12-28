/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Shelly} from 'shellies';
import {SwitchProperty} from './switch-property';
import {BrightnessProperty} from './brightness-property';
import {ShellyMeter} from './shelly-meter';
import {Adapter} from 'gateway-addon';

export class ShellyDimmer extends ShellyMeter {
    private switchProperty: SwitchProperty;

    private brightnessProperty: BrightnessProperty;

    constructor(adapter: Adapter, device: Shelly) {
      super(adapter, device);
      this['@context'] = 'https://iot.mozilla.org/schemas/';
      this['@type'].push('Light');

      this.switchProperty = new SwitchProperty(
        this, 'switch', 'Switch', true, async (value) => {
          const brightness = await this.brightnessProperty.getValue();
          console.log(`setWhite(${brightness}, ${value})`);
          device.setWhite(brightness, value);
        });

      this.addProperty(this.switchProperty);

      this.brightnessProperty = new BrightnessProperty(
        this, 'brightness', async (value) => {
          const switchValue = await this.switchProperty.getValue();
          console.log(`setWhite(${value}, ${switchValue})`);
          device.setWhite(value, switchValue);
        });

      this.addProperty(this.brightnessProperty);
    }
}
