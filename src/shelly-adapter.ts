/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Adapter } from 'gateway-addon';
import shellies from 'shellies';
import { Config } from './config';
import { ShellyDimmer } from './shelly-dimmer';
import { ShellyDoorWindow2 } from './shelly-door-window-2';
import { ShellyHT } from './shelly-ht';
import { ShellySwitch } from './shelly-switch';

export class ShellyAdapter extends Adapter {
    constructor(addonManager: any, manifest: any) {
        super(addonManager, ShellyAdapter.name, manifest.name);
        addonManager.addAdapter(this);

        const {
            username,
            password,
        } = <Config><unknown>manifest.moziot.config;

        if (username && password) {
            shellies.setAuthCredentials(username, password);
        }

        shellies.on('discover', device => {
            console.log(`Discovered new ${device.constructor.name} with id ${device.id}`);

            switch (device.constructor.name) {
                case 'ShellyDimmer': {
                    const shelly = new ShellyDimmer(this, device);
                    this.handleDeviceAdded(shelly);
                    break;
                }
                case 'ShellyHT': {
                    const shelly = new ShellyHT(this, device);
                    this.handleDeviceAdded(shelly);
                    break
                }
                case 'ShellyDoorWindow2': {
                    const shelly = new ShellyDoorWindow2(this, device);
                    this.handleDeviceAdded(shelly);
                    break
                }
                default:
                    if ((<any>device)['relay0'] != undefined) {
                        const shelly = new ShellySwitch(this, device);
                        this.handleDeviceAdded(shelly);
                    }
                    break;
            }
        })

        shellies.start();
    }
}
