/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Property, Device } from 'gateway-addon';
import { MainSwitchProperty } from './main-switch-property';

export class SwitchProperty extends Property {
    constructor(device: Device, name: string, title: string, primary: boolean,
        private onChange: (value: boolean) => void,
        private mainSwitchProperty?: MainSwitchProperty) {
        super(device, name, {
            type: 'boolean',
            '@type': primary ? 'OnOffProperty' : undefined,
            title,
            description: 'The state of the switch'
        });
    }

    async setValue(value: any): Promise<void> {
        super.setValue(value);
        this.onChange(value);
    }

    public setCachedValueAndNotify(value: any) {
        super.setCachedValueAndNotify(value);

        if (this.mainSwitchProperty) {
            this.mainSwitchProperty.setSwitchValue(this.name, value);
        }
    }
}
