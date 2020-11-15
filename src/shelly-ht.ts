/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Shelly } from 'shellies';
import { BatteryProperty } from './battery-property';
import { HumidityProperty } from './humidity-property';
import { ShellyDevice } from './shelly-device';
import { TemperatureProperty } from './temperature-property';

export class ShellyHT extends ShellyDevice {
    constructor(adapter: any, device: Shelly) {
        super(adapter, device);
        this['@type'].push('TemperatureSensor');
        this['@type'].push('HumiditySensor');

        const temperature = new TemperatureProperty(this, 'temperature', 'Temperature');
        this.addProperty('temperature', temperature);
        temperature.setCachedValueAndNotify(device.temperature);

        const humidity = new HumidityProperty(this, 'humidity', 'Humidity');
        this.addProperty('humidity', humidity);
        humidity.setCachedValueAndNotify(device.humidity);

        const battery = new BatteryProperty(this, 'battery', 'Battery');
        this.addProperty('battery', battery);
        battery.setCachedValueAndNotify(device.battery);
    }
}
