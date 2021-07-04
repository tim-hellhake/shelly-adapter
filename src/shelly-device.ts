/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Action, Adapter, Device, Property} from 'gateway-addon';
import {Action as ActionSchema, Any} from 'gateway-addon/lib/schema';
import {Shelly} from 'shellies';
import {debug} from './log';
import {TemperatureProperty} from './properties/temperature-property';

export class ShellyDevice extends Device {
    private callbacks: { [key: string]: () => void } = {};

    private propertyByAlias: Record<string, Property<Any>> = {};

    constructor(adapter: Adapter, device: Shelly) {
      super(adapter, device.id);
      this['@context'] = 'https://iot.mozilla.org/schemas/';
      this['@type'] = [];
      this.setTitle(`${device.constructor.name} (${device.id})`);

      device.on(
        'change',
        (prop: string, newValue: Any, oldValue: Any) => {
          debug(
            `${device.id} ${prop} changed from ${oldValue} to ${newValue}`);

          const property =
          this.propertyByAlias[prop] ?? this.findProperty(prop);

          if (property) {
            property.setCachedValueAndNotify(newValue);
          } else {
            console.warn(`No property for ${prop} found`);
          }
        });

      if (device.deviceTemperature) {
        console.log(`Detected deviceTemperature property`);
        const property = new TemperatureProperty(
          this, 'internalTemperature', 'Device temperature');
        this.addPropertyWithAlias('deviceTemperature', property);
      }
    }

    protected addPropertyWithAlias(
      shellyProperty: string, property: Property<Any>): void {
      this.addProperty(property);
      this.propertyByAlias[shellyProperty] = property;
    }

    protected addCallbackAction(
      name: string, description: ActionSchema,
      callback: () => void): void {
      this.addAction(name, description);
      this.callbacks[name] = callback;
    }

    async performAction(action: Action): Promise<void> {
      action.start();

      const name = action.asActionDescription().name;
      const callback = this.callbacks[name];

      if (callback) {
        debug(`Executing action ${name}`);
        callback();
      } else {
        console.warn(`Unknown action ${name}`);
      }

      action.finish();
    }
}
