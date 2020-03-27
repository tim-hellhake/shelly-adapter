/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Device } from 'gateway-addon';
import { Shelly } from 'shellies';
import { SwitchProperty } from './switch-property';
import { TemperatureProperty } from './temperature-property';
import { PowerProperty } from './power-property';
import { MainPowerProperty } from './main-power-property';
import { MainSwitchProperty } from './main-switch-property';

export class ShellyDevice extends Device {
    private callbacks: { [key: string]: () => void } = {};

    constructor(adapter: any, private device: Shelly) {
        super(adapter, device.id);
        this['@context'] = 'https://iot.mozilla.org/schemas/';
        this['@type'] = [];
        this.name = `${device.constructor.name} (${device.id})`;

        device.on('change', (prop: any, newValue: any, oldValue: any) => {
            console.log(`${prop} changed from ${oldValue} to ${newValue}`);
            const property = this.properties.get(prop);
            if (property) {
                property.setCachedValueAndNotify(newValue);
            }
            else {
                console.warn(`No property for ${prop} found`);
            }
        });

        if (device.mode) {
            switch (device.mode) {
                case 'relay':
                    this.configureRelayMode();
                    break;
                case 'roller':
                    this.configureRollerMode();
                    break;
                default:
                    console.warn(`Unknown device mode: ${device.mode}`);
                    break;
            }
        } else {
            console.log('No switch mode found, assuming relay');
            this.configureRelayMode();
        }

        if (device.internalTemperature) {
            console.log(`Detected internalTemperature property`);
            new TemperatureProperty(this, 'internalTemperature', 'Internal temperature');
        }

        this.configurePowerMeters();
    }

    addCallbackAction(name: string, description: any, callback: () => void) {
        this.addAction(name, description);
        this.callbacks[name] = callback;
    }

    async performAction(action: any) {
        action.start();

        const callback = this.callbacks[action.name];

        if (callback != undefined) {
            console.log(`Executing action ${action.name}`);
            callback();
        } else {
            console.warn(`Unknown action ${action.name}`);
        }

        action.finish();
    }

    private configureRelayMode(): void {
        console.log('Configuring relay mode');
        this['@type'].push('SmartPlug');

        const relays: number[] = []

        for (let i = 0; i < 4; i++) {
            const property = `relay${i}`;

            if ((<any>this.device)[property] != undefined) {
                relays.push(i);
            }
        }

        const multiple = relays.length > 1;
        let mainSwitchProperty: MainSwitchProperty | undefined;

        if (multiple) {
            mainSwitchProperty = new MainSwitchProperty(this, 'relay', 'All', true, (value) => {
                for (const i of relays) {
                    this.device.setRelay(i, value);
                }
            });
        }

        for (const i of relays) {
            const property = `relay${i}`;
            new SwitchProperty(this, property, `Relay ${i}`, !multiple, (value) => this.device.setRelay(i, value), mainSwitchProperty);
        }
    }

    private configureRollerMode(): void {
        console.log('Configuring roller mode');

        this.addCallbackAction('open', {
            title: 'Open'
        }, () => {
            this.device.setRollerState('open');
        });

        this.addCallbackAction('stop', {
            title: 'Stop'
        }, () => {
            this.device.setRollerState('stop');
        });

        this.addCallbackAction('close', {
            title: 'Close'
        }, () => {
            this.device.setRollerState('close');
        });
    }

    private configurePowerMeters(): void {
        console.log('Configuring power meters');
        const powerMeters: number[] = []

        for (let i = 0; i < 4; i++) {
            const property = `powerMeter${i}`;

            if ((<any>this.device)[property] != undefined) {
                powerMeters.push(i);
            }
        }

        const multiple = powerMeters.length > 1;
        let mainPowerMeter: MainPowerProperty | undefined;

        if (multiple) {
            mainPowerMeter = new MainPowerProperty(this, 'powerMeter', 'Power all');
        }

        for (const i of powerMeters) {
            const property = `powerMeter${i}`;
            new PowerProperty(this, property, `Power ${i}`, !multiple, mainPowerMeter);
        }
    }
}
