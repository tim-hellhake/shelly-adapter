/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Shelly } from 'shellies';
import { SwitchProperty } from './switch-property';
import { MainSwitchProperty } from './main-switch-property';
import { RollerPositionProperty } from "./roller-position-property";
import { ShellyMeter } from './shelly-meter';

export class ShellySwitch extends ShellyMeter {
    constructor(adapter: any, private device: Shelly) {
        super(adapter, device);

        if (device.mode) {
            switch (device.mode) {
                case 'relay':
                    this.configureRelayMode();
                    break;
                case 'roller':
                    this.configureRollerPosition();
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
    }

    private configureRollerPosition(): void {
        const rollerPositionProperty = new RollerPositionProperty(this, 'rollerPosition', 'Opening level in %', (value) => {
            this.device.setRollerPosition(value).catch(reason => {
                console.log(reason);
            })
        });

        this.addProperty(rollerPositionProperty);

        if (this.device.rollerPosition) {
            rollerPositionProperty.setCachedValueAndNotify(this.device.rollerPosition);
        }
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
            const switchProperty = new SwitchProperty(this, property, `Relay ${i}`, !multiple, (value) => this.device.setRelay(i, value), mainSwitchProperty);
            this.addProperty(switchProperty);
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
}
