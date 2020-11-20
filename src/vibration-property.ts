/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import { Property } from 'gateway-addon';
import { ShellyDevice } from './shelly-device';

export class VibrationProperty extends Property {
    constructor(device: ShellyDevice, name: string, title: string) {
        super(device, name, {
            '@type': 'BooleanProperty',
            type: 'boolean',
            title,
            readOnly: true
        });
    }
}
