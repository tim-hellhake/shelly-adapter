/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Property, Device} from 'gateway-addon';
import {MainSwitchProperty} from './main-switch-property';

export class SwitchProperty extends Property<boolean> {
  constructor(device: Device, name: string, title: string, primary: boolean,
        // eslint-disable-next-line no-unused-vars
        private onChange: (value: boolean) => Promise<void>,
        // eslint-disable-next-line no-unused-vars
        private mainSwitchProperty?: MainSwitchProperty) {
    super(device, name, {
      type: 'boolean',
      // eslint-disable-next-line no-undefined
      '@type': primary ? 'OnOffProperty' : undefined,
      title,
      description: 'The state of the switch',
    });
  }

  async setValue(value: boolean): Promise<boolean> {
    const newVal = await super.setValue(value);
    await this.onChange(newVal);
    return newVal;
  }

  public setCachedValueAndNotify(value: boolean): boolean {
    const changed = super.setCachedValueAndNotify(value);

    if (this.mainSwitchProperty) {
      this.mainSwitchProperty.setSwitchValue(this.getName(), value);
    }

    return changed;
  }
}
