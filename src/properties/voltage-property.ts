/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Property} from 'gateway-addon';
import {ShellyDevice} from '../devices/shelly-device';

export class VoltageProperty extends Property<number> {
  constructor(device: ShellyDevice, name: string, title: string) {
    super(device, name, {
      '@type': 'VoltageProperty',
      type: 'number',
      unit: 'volt',
      multipleOf: 0.01,
      title,
      readOnly: true,
    });
  }
}
