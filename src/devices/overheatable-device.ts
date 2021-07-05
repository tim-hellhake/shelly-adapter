/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Adapter} from 'gateway-addon';
import {TemperatureProperty} from '../properties/temperature-property';
import {ShellyDevice} from './shelly-device';

export class OverheatableDevice extends ShellyDevice {

  constructor(adapter: Adapter, id: string) {
    super(adapter, id);
    this['@type'].push('TemperatureSensor');
    this.addProperty(new TemperatureProperty(this, 'internalTemperature', 'Temperature'));
  }
}
