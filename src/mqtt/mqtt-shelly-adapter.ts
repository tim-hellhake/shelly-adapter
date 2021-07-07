/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {connect} from 'mqtt';
import {Adapter, AddonManagerProxy} from 'gateway-addon';
import {Config} from '../config';
import {debug} from '../log';
import {ShellyDevice} from '../devices/shelly-device';
import {ShellyHT} from '../devices/shelly-ht';
import {Any} from 'gateway-addon/lib/schema';

export class MqttShellyAdapter extends Adapter {
  private foundDevices: Record<string, ShellyDevice> = {};

  constructor(addonManager: AddonManagerProxy,
              id: string,
              config: Config,
              // eslint-disable-next-line no-unused-vars
              errorCallback: (error: string) => void) {
    super(addonManager, MqttShellyAdapter.name, id);
    addonManager.addAdapter(this);

    const {
      mqttBroker,
    } = config;

    const address = `mqtt://${mqttBroker ?? 'localhost'}`;
    const client = connect(address);

    client.on('connect', () => {
      console.log(`Connected to ${address}`);
      const topic = 'shellies/#';

      client.subscribe(topic, () => {
        console.log(`Subscribed to ${topic}`);
      });
    });

    client.on('error', (err) => {
      errorCallback(`Mqtt error: ${err}`);
    });

    client.on('message', (topic, message) => {
      debug(`Received on ${topic}: ${message}`);
      const topicParts = topic.split('/');
      const [, device] = topicParts;

      if (device) {
        const delimiter = device.lastIndexOf('-');

        if (delimiter > 0) {
          const type = device.substring(0, delimiter);
          const id = device.substring(delimiter + 1);
          debug(`Received update for ${id} (${type})`);
          const property = this.getPropertyName(topicParts);
          const payload = message.toString();

          if (property) {
            this.updateDevice(type, `shelly-mqtt-${id}`, property, payload);
          }
        }
      }
    });
  }

  private getPropertyName(parts: string[]) : string | null {
    switch (parts.length) {
      case 4: {
        const [,, property, subproperty] = parts;
        switch (property) {
          case 'sensor':
            return subproperty;
          default:
            console.log(`Unknown property ${property}`);
            break;
        }
        break;
      }
      default:
        console.log(`Unexpected parts length ${parts.length}`);
        break;
    }

    return null;
  }

  private updateDevice(type: string, id: string, name: string, value: string) {
    const device = this.getOrCreateDevice(type, id);

    if (device) {
      const property = device.findProperty(name);

      if (property) {
        property.setCachedValueAndNotify(value as Any);
      } else {
        console.warn(`No property for ${name} in ${device.constructor.name} found`);
      }
    }
  }

  private getOrCreateDevice(type: string, id: string): ShellyDevice | null {
    const foundDevice = this.foundDevices[id];

    if (foundDevice) {
      return foundDevice;
    }

    const createdDevice = this.createDevice(type, id);

    if (createdDevice) {
      console.log(`Created device for ${createdDevice.constructor.name} ${id} (${type})`);
      this.foundDevices[id] = createdDevice;
      this.handleDeviceAdded(createdDevice);
      return createdDevice;
    }

    return null;
  }

  private createDevice(type: string, id: string): ShellyDevice | null {
    switch (type) {
      case 'shellyht':
        return new ShellyHT(this, id);
      default:
        console.log(`Unknown device type ${type}`);
    }

    return null;
  }
}
