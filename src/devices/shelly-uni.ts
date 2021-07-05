/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Adapter} from 'gateway-addon';
import {ShellyDevice} from './shelly-device';
import {TemperatureProperty} from '../properties/temperature-property';
import {InputProperty} from '../properties/input-property';
import {HumidityProperty} from '../properties/humidity-property';
import {VoltageProperty} from '../properties/voltage-property';
import {ShellyController} from '../shelly-controller';

export class ShellyUni extends ShellyDevice {

  constructor(adapter: Adapter, id: string, controller: ShellyController) {
    super(adapter, id);
    this['@context'] = 'https://iot.mozilla.org/schemas/';
    this['@type'].push('SmartPlug');

    this.addRelays(2, controller);

    for (const i of [0, 1]) {
      this.addProperty(new InputProperty(this, `input${i}`, `Input ${i}`));
    }

    for (let i = 0; i < 5; i++) {
      this.addProperty(new TemperatureProperty(
        this, `externalTemperature${i}`, `External temperature ${i}`));
    }

    this.addProperty(new HumidityProperty(this, 'externalHumidity', 'External humidity'));
    this.addProperty(new VoltageProperty(this, 'voltage0', 'Voltage'));
  }
}
