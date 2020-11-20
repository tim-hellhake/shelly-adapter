/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Shelly } from 'shellies';
import { BatteryProperty } from './battery-property';
import { IlluminanceProperty } from './illuminance-property';
import { OpenProperty } from './open-property';
import { ShellyDevice } from './shelly-device';
import { TemperatureProperty } from './temperature-property';
import { VibrationProperty } from './vibration-property';

export class ShellyDoorWindow2 extends ShellyDevice {
    constructor(adapter: any, device: Shelly) {
        super(adapter, device);
        this['@type'].push('DoorSensor', 'TemperatureSensor');

        const state = new OpenProperty(this, 'state');
        this.addProperty('state', state);
        state.setCachedValueAndNotify(Boolean(device.state));

        const vibration = new VibrationProperty(this, 'vibration', 'Vibration');
        this.addProperty('vibration', vibration);
        vibration.setCachedValueAndNotify(device.vibration);

        const temperature = new TemperatureProperty(this, 'temperature', 'Temperature');
        this.addProperty('temperature', temperature);
        temperature.setCachedValueAndNotify(device.temperature);

        const battery = new BatteryProperty(this, 'battery', 'Battery');
        this.addProperty('battery', battery);
        battery.setCachedValueAndNotify(device.battery);

        const illuminance = new IlluminanceProperty(this, 'illuminance', 'Illuminance');
        this.addProperty('illuminance', illuminance);
        illuminance.setCachedValueAndNotify(device.illuminance);
    }
}
