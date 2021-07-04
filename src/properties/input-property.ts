/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Property, Device} from 'gateway-addon';

export class InputProperty extends Property<boolean> {
  constructor(device: Device, name: string, title: string) {
    super(device, name, {
      type: 'boolean',
      '@type': 'InputProperty',
      title,
      readOnly: true,
    });
  }

  setCachedValueAndNotify(value: boolean): boolean {
    const convertedValue = (value as unknown as number) === 1;
    return super.setCachedValueAndNotify(convertedValue);
  }
}
