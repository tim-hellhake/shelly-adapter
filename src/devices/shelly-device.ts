/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Action, Adapter, Device} from 'gateway-addon';
import {Action as ActionSchema} from 'gateway-addon/lib/schema';
import {debug} from '../log';
import {MainPowerProperty} from '../properties/main-power-property';
import {MainSwitchProperty} from '../properties/main-switch-property';
import {PowerProperty} from '../properties/power-property';
import {SwitchProperty} from '../properties/switch-property';
import {ShellyController} from '../shelly-controller';

export class ShellyDevice extends Device {
    private callbacks: { [key: string]: () => void } = {};

    constructor(adapter: Adapter, id: string) {
      super(adapter, id);
      this['@context'] = 'https://iot.mozilla.org/schemas/';
      this['@type'] = [];
      this.setTitle(`${this.constructor.name} (${id})`);
    }

    protected addRelays(count: number, controller: ShellyController): void {
      this['@type'].push('SmartPlug');

      if (count == 1) {
        this.addProperty(new SwitchProperty(
          this, 'relay0', 'Relay', true, (value) => controller.setRelay(0, value)));
      } else {
        const mainSwitchProperty = new MainSwitchProperty(
          this, 'relay', 'All', true, (value) => {
            for (let i = 0; i < count; i++) {
              controller.setRelay(i, value);
            }
          });

        this.addProperty(mainSwitchProperty);

        for (let i = 0; i < count; i++) {
          this.addProperty(new SwitchProperty(
            this, `relay${i}`, `Relay ${i}`, false,
            (value) => controller.setRelay(i, value), mainSwitchProperty));
        }
      }
    }

    protected addPowermeters(count: number): void {
      if (count == 1) {
        this.addProperty(new PowerProperty(this, `powerMeter0`, `Power`, true));
      } else {
        const mainPowerMeter = new MainPowerProperty(this, 'power', 'Power all');

        this.addProperty(mainPowerMeter);

        for (let i = 0; i < count; i++) {
          this.addProperty(new PowerProperty(
            this, `powerMeter${i}`, `Power ${i}`, false, mainPowerMeter));
        }
      }
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
