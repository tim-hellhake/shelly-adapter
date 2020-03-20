/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Adapter } from 'gateway-addon';
import shellies from 'shellies';
import { ShellyDevice } from './shelly-device';
import { ShellyDimmer } from './shelly-dimmer';

export class ShellyAdapter extends Adapter {
    constructor(addonManager: any, manifest: any) {
        super(addonManager, ShellyAdapter.name, manifest.name);
        addonManager.addAdapter(this);

        const {
        } = manifest.moziot.config;

        shellies.on('discover', device => {
            if (device.relay0 != undefined) {
                console.log(`Discovered new ${device.constructor.name} with id ${device.id}`);
                const shelly = new ShellyDevice(this, device);
                this.handleDeviceAdded(shelly);
            } else {
                if (device.constructor.name == 'ShellyDimmer') {
                    console.log(`Discovered new ${device.constructor.name} with id ${device.id}`);
                    const shelly = new ShellyDimmer(this, device);
                    this.handleDeviceAdded(shelly);
                }
            }
        })

        shellies.start();
    }
}
