/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Adapter, Device, Property } from 'gateway-addon';
import shellies, { Shelly } from 'shellies';

class SwitchProperty extends Property {
    constructor(device: ShellyDevice, name: string, private onChange: (value: boolean) => void) {
        super(device, name, {
            type: 'boolean',
            '@type': 'OnOffProperty',
            title: 'State',
            description: 'The state of the switch'
        });

        device.properties.set(name, this);
    }

    async setValue(value: any): Promise<void> {
        super.setValue(value);
        this.onChange(value);
    }
}

class ShellyDevice extends Device {
    constructor(adapter: any, device: Shelly) {
        super(adapter, device.id);
        this['@context'] = 'https://iot.mozilla.org/schemas/';
        this['@type'] = ['SmartPlug'];
        this.name = `${device.constructor.name} (${device.id})`;

        new SwitchProperty(this, 'relay0', (value) => device.setRelay(0, value));

        device.on('change', (prop: any, newValue: any, oldValue: any) => {
            console.log(`${prop} changed from ${oldValue} to ${newValue}`);
            const property = this.properties.get(prop);

            if (property) {
                property.setCachedValueAndNotify(newValue);
            } else {
                console.warn(`No property for ${prop} found`);
            }
        })
    }
}

class BrightnessProperty extends Property {
    constructor(device: ShellyDevice, name: string, private onChange: (value: number) => void) {
        super(device, name, {
            type: 'number',
            '@type': 'BrightnessProperty',
            title: 'brightness',
            description: 'The brightness of the dimmer'
        });

        device.properties.set(name, this);
    }

    async setValue(value: any): Promise<void> {
        super.setValue(value);
        this.onChange(value);
    }
}

class ShellyDimmer extends Device {
    private switchProperty: SwitchProperty;
    private brightnessProperty: BrightnessProperty;

    constructor(adapter: any, device: Shelly) {
        super(adapter, device.id);
        this['@context'] = 'https://iot.mozilla.org/schemas/';
        this['@type'] = ['Light'];
        this.name = `${device.constructor.name} (${device.id})`;

        this.switchProperty = new SwitchProperty(this, 'switch', (value) => {
            console.log(`setWhite(${this.brightnessProperty.value}, ${value})`);
            device.setWhite(this.brightnessProperty.value, value);
        });
        this.brightnessProperty = new BrightnessProperty(this, 'brightness', (value) => {
            console.log(`setWhite(${value}, ${this.switchProperty.value})`);
            device.setWhite(value, this.switchProperty.value)
        });

        device.on('change', (prop: any, newValue: any, oldValue: any) => {
            console.log(`${prop} changed from ${oldValue} to ${newValue}`);
            const property = this.properties.get(prop);

            if (property) {
                property.setCachedValueAndNotify(newValue);
            } else {
                console.warn(`No property for ${prop} found`);
            }
        })
    }
}

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
