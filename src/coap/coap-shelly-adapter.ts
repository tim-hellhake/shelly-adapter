/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {networkInterfaces} from 'os';
import {Adapter, AddonManagerProxy} from 'gateway-addon';
import shellies, {Shelly} from 'shellies';
import {Config} from '../config';
import {ShellyDimmer} from '../devices/shelly-dimmer';
import {ShellyUni} from '../devices/shelly-uni';
import {debug} from '../log';
import {ShellyHT} from '../devices/shelly-ht';
import {ShellyDoorWindow2} from '../devices/shelly-door-window-2';
import {ShellyDevice} from '../devices/shelly-device';
import {Any} from 'gateway-addon/lib/schema';
import {Shelly25Relay} from '../devices/shelly-25-relay';
import {Shelly1} from '../devices/shelly-1';
import {Shelly1PM} from '../devices/shelly-1pm';
import {Shelly2Relay} from '../devices/shelly-2-relay';
import {Shelly3EM} from '../devices/shelly-3em';
import {Shelly4Pro} from '../devices/shelly-4-pro';
import {ShellyPlug} from '../devices/shelly-plug';
import {ShellyPlugS} from '../devices/shelly-plug-s';
import {Shelly2Roller} from '../devices/shelly-2-roller';

export class CoapShellyAdapter extends Adapter {
  constructor(addonManager: AddonManagerProxy,
              id: string,
              config: Config,
              // eslint-disable-next-line no-unused-vars
              errorCallback: (error: string) => void) {
    super(addonManager, CoapShellyAdapter.name, id);
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

      const shellyDevice = this.createDevice(device);

      if (shellyDevice) {
        console.log(`Created ${shellyDevice.constructor.name}`);

        this.handleDeviceAdded(shellyDevice);

        device.on(
          'change',
          (prop: string, newValue: unknown, oldValue: unknown) => {
            debug(
              `${device.id} ${prop} changed from ${oldValue} to ${newValue}`);

            let actualName = prop;

            if (prop === 'deviceTemperature') {
              actualName = 'internalTemperature';
            }

            if (prop.match(/power\d+/)) {
              actualName = prop.replace('power', 'powerMeter');
            }

            const property = shellyDevice.findProperty(actualName);

            if (property) {
              property.setCachedValueAndNotify(newValue as Any);
            } else {
              console.warn(`No property for ${prop} found`);
            }
          });
      } else {
        console.log(`Unknown device type ${device.constructor.name}`);
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

  private createDevice(device: Shelly): ShellyDevice | null {
    switch (device.constructor.name) {
      case 'ShellyDimmer':
      case 'ShellyDimmer2': {
        return new ShellyDimmer(this, device.id, device);
      }
      case 'ShellyHT': {
        return new ShellyHT(this, device.id);
      }
      case 'ShellyDoorWindow2': {
        return new ShellyDoorWindow2(this, device.id);
      }
      case 'ShellyUni': {
        return new ShellyUni(this, device.id, device);
      }
      case 'Shelly1': {
        return new Shelly1(this, device.id, device);
      }
      case 'Shelly1PM': {
        return new Shelly1PM(this, device.id, device);
      }
      case 'Shelly2': {
        switch (device.mode) {
          case 'relay':
            return new Shelly2Relay(this, device.id, device);
          case 'roller':
            return new Shelly2Roller(this, device.id, device);
          default:
            console.warn(`Unknown device mode: ${device.mode}`);
            break;
        }
        break;
      }
      case 'Shelly25': {
        switch (device.mode) {
          case 'relay':
            return new Shelly25Relay(this, device.id, device);
          case 'roller':
            return new Shelly2Roller(this, device.id, device);
          default:
            console.warn(`Unknown device mode: ${device.mode}`);
            break;
        }
        break;
      }
      case 'Shelly3EM': {
        return new Shelly3EM(this, device.id, device);
      }
      case 'Shelly4Pro': {
        return new Shelly4Pro(this, device.id, device);
      }
      case 'ShellyPlug':
      case 'ShellyPlugUS':
      case 'ShellyPlugE': {
        return new ShellyPlug(this, device.id, device);
      }
      case 'ShellyPlugS': {
        return new ShellyPlugS(this, device.id, device);
      }
    }

    return null;
  }
}
