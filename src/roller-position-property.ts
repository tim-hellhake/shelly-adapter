/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Property, Device} from 'gateway-addon';

export class RollerPositionProperty extends Property<number> {
  constructor(device: Device, name: string, title: string,
    // eslint-disable-next-line no-unused-vars
    private onChange: (value: number) => void) {
    super(device, name, {
      type: 'number',
      '@type': 'LevelProperty',
      minimum: 0,
      maximum: 100,
      title: title,
      description: 'The roller shutter position in percent',
    });
  }

  async setValue(value: number): Promise<number> {
    const newVal = await super.setValue(value);
    this.onChange(newVal);
    return newVal;
  }
}
