/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {networkInterfaces} from 'os';
import {Adapter, AddonManagerProxy} from 'gateway-addon';
import shellies from 'shellies';
import {Config} from './config';
import {ShellyDimmer} from './shelly-dimmer';
import {ShellyDoorWindow2} from './shelly-door-window-2';
import {ShellyHT} from './shelly-ht';
import {ShellySwitch} from './shelly-switch';
import {ShellyUni} from './shelly-uni';
import {debug} from './log';

export class ShellyAdapter extends Adapter {
  constructor(addonManager: AddonManagerProxy,
              id: string,
              config: Config,
              // eslint-disable-next-line no-unused-vars
              errorCallback: (error: string) => void) {
    super(addonManager, ShellyAdapter.name, id);
    addonManager.addAdapter(this);

    const {
      username,
      password,
      networkInterface,
    } = config;

    if (username && password) {
      shellies.setAuthCredentials(username, password);
    }

    shellies.on('discover', (device) => {
      console.log(
        `Discovered new ${device.constructor.name} with id ${device.id}`);

      debug(device);

      switch (device.constructor.name) {
        case 'ShellyDimmer':
        case 'ShellyDimmer2': {
          const shelly = new ShellyDimmer(this, device);
          this.handleDeviceAdded(shelly);
          break;
        }
        case 'ShellyHT': {
          const shelly = new ShellyHT(this, device);
          this.handleDeviceAdded(shelly);
          break;
        }
        case 'ShellyDoorWindow2': {
          const shelly = new ShellyDoorWindow2(this, device);
          this.handleDeviceAdded(shelly);
          break;
        }
        case 'ShellyUni': {
          const shelly = new ShellyUni(this, device);
          this.handleDeviceAdded(shelly);
          break;
        }
        default:
          if (device.hasOwnProperty('relay0')) {
            const shelly = new ShellySwitch(this, device);
            this.handleDeviceAdded(shelly);
          }
          break;
      }
    });

    if (networkInterface) {
      const interfaces = networkInterfaces();
      const subInterfaces = interfaces[networkInterface];

      if (!subInterfaces) {
        const ifs = Object.keys(interfaces);
        const msg = `Network interface ${networkInterface} does not exist in ${ifs}`;
        errorCallback(msg);
        throw new Error(msg);
      }

      let interfaceAddress = '';

      for (const subInterface of subInterfaces) {
        if (subInterface.family === 'IPv4') {
          interfaceAddress = subInterface.address;
        }
      }

      if (!interfaceAddress) {
        errorCallback(`No IPv4 interface found on ${networkInterfaces}`);
      }

      console.log(`Starting on ${interfaceAddress}`);

      shellies.start(interfaceAddress);
    } else {
      shellies.start();
    }
  }
}
