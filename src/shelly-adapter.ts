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

        device.on('change', (prop: any, newValue: any, _oldValue: any) => {
            const property = this.properties.get(prop);

            if (property) {
                property.setCachedValue(newValue);
                this.notifyPropertyChanged(property);
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
            }
        })

        shellies.start();
    }
}
