/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {SwitchProperty} from '../properties/switch-property';
import {BrightnessProperty} from '../properties/brightness-property';
import {Adapter} from 'gateway-addon';
import {debug} from '../log';
import {ShellyController} from '../shelly-controller';
import {OverheatableDevice} from './overheatable-device';

export class ShellyDimmer extends OverheatableDevice {
    private switchProperty: SwitchProperty;

    private brightnessProperty: BrightnessProperty;

    constructor(adapter: Adapter, id: string, controller: ShellyController) {
      super(adapter, id);
      this['@context'] = 'https://iot.mozilla.org/schemas/';
      this['@type'].push('Light');

      this.addPowermeters(1);

      this.switchProperty = new SwitchProperty(
        this, 'switch', 'Switch', true, async (value) => {
          const brightness = await this.brightnessProperty.getValue();
          debug(`setWhite(${brightness}, ${value})`);
          controller.setWhite(brightness, value);
        });

      this.addProperty(this.switchProperty);

      this.brightnessProperty = new BrightnessProperty(
        this, 'brightness', async (value) => {
          const switchValue = await this.switchProperty.getValue();
          debug(`setWhite(${value}, ${switchValue})`);
          controller.setWhite(value, switchValue);
        });

      this.addProperty(this.brightnessProperty);
    }
}
