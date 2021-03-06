/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Property, Device} from 'gateway-addon';

export class BatteryProperty extends Property<number> {
  constructor(device: Device, name: string, title: string) {
    super(device, name, {
      '@type': 'LevelProperty',
      type: 'number',
      unit: 'percent',
      minimum: 0,
      maximum: 100,
      multipleOf: 0.1,
      title,
      readOnly: true,
    });
  }
}
