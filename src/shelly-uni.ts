/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Shelly} from 'shellies';
import {Adapter} from 'gateway-addon';
import {ShellyDevice} from './shelly-device';
import {SwitchProperty} from './switch-property';
import {MainSwitchProperty} from './main-switch-property';
import {TemperatureProperty} from './temperature-property';
import {InputProperty} from './input-property';

export class ShellyUni extends ShellyDevice {

  constructor(adapter: Adapter, device: Shelly) {
    super(adapter, device);
    this['@context'] = 'https://iot.mozilla.org/schemas/';
    this['@type'].push('SmartPlug');

    const relays = [0, 1];

    const mainSwitchProperty = new MainSwitchProperty(
      this, 'relay', 'All', true, (value) => {
        for (const i of relays) {
          device.setRelay(i, value);
        }
      });

    for (const i of relays) {
      const property = `relay${i}`;
      const switchProperty = new SwitchProperty(
        this, property, `Relay ${i}`, false,
        (value) => device.setRelay(i, value), mainSwitchProperty);
      this.addProperty(switchProperty);
    }

    for (const i of [0, 1]) {
      const property = `input${i}`;
      const inputProperty = new InputProperty(
        this, property, `Input ${i}`);
      this.addProperty(inputProperty);
    }

    for (let i = 0; i < 5; i++) {
      const temperatureProperty = new TemperatureProperty(
        this, `externalTemperature${i}`, `External temperature ${i}`);
      this.addProperty(temperatureProperty);
    }
  }
}
