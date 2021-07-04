/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Adapter} from 'gateway-addon';
import {Shelly} from 'shellies';
import {BatteryProperty} from './properties/battery-property';
import {IlluminanceProperty} from './properties/illuminance-property';
import {OpenProperty} from './properties/open-property';
import {ShellyDevice} from './shelly-device';
import {TemperatureProperty} from './properties/temperature-property';
import {VibrationProperty} from './properties/vibration-property';
import {TiltProperty} from './properties/tilt-property';

export class ShellyDoorWindow2 extends ShellyDevice {
  constructor(adapter: Adapter, device: Shelly) {
    super(adapter, device);
    this['@type'].push('DoorSensor', 'TemperatureSensor');

    const state = new OpenProperty(this, 'state');
    this.addProperty(state);

    if (typeof device.state === 'boolean') {
      state.setCachedValueAndNotify(device.state);
    }

    const vibration = new VibrationProperty(this, 'vibration', 'Vibration');
    this.addProperty(vibration);

    if (typeof device.vibration === 'boolean') {
      vibration.setCachedValueAndNotify(device.vibration);
    }

    const temperature = new TemperatureProperty(
      this, 'temperature', 'Temperature');
    this.addProperty(temperature);

    if (typeof device.temperature === 'number') {
      temperature.setCachedValueAndNotify(device.temperature);
    }

    const battery = new BatteryProperty(this, 'battery', 'Battery');
    this.addProperty(battery);

    if (typeof device.battery === 'number') {
      battery.setCachedValueAndNotify(device.battery);
    }

    const illuminance = new IlluminanceProperty(
      this, 'illuminance', 'Illuminance');
    this.addProperty(illuminance);

    if (typeof device.illuminance === 'number') {
      illuminance.setCachedValueAndNotify(device.illuminance);
    }

    const tilt = new TiltProperty(this, 'tilt', 'Tilt Angle');
    this.addProperty(tilt);

    if (typeof device.tilt === 'number') {
      tilt.setCachedValueAndNotify(device.tilt);
    }
  }
}
