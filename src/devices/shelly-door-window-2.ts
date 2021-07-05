/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Adapter} from 'gateway-addon';
import {BatteryProperty} from '../properties/battery-property';
import {IlluminanceProperty} from '../properties/illuminance-property';
import {OpenProperty} from '../properties/open-property';
import {ShellyDevice} from './shelly-device';
import {TemperatureProperty} from '../properties/temperature-property';
import {VibrationProperty} from '../properties/vibration-property';
import {TiltProperty} from '../properties/tilt-property';

export class ShellyDoorWindow2 extends ShellyDevice {
  constructor(adapter: Adapter, id: string) {
    super(adapter, id);
    this['@type'].push('DoorSensor', 'TemperatureSensor');

    this.addProperty(new OpenProperty(this, 'state'));
    this.addProperty(new VibrationProperty(this, 'vibration', 'Vibration'));
    this.addProperty(new TemperatureProperty(this, 'temperature', 'Temperature'));
    this.addProperty(new BatteryProperty(this, 'battery', 'Battery'));
    this.addProperty(new IlluminanceProperty(this, 'illuminance', 'Illuminance'));
    this.addProperty(new TiltProperty(this, 'tilt', 'Tilt Angle'));
  }
}
