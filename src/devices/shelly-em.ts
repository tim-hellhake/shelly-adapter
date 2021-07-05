/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Adapter} from 'gateway-addon';
import {OverheatableDevice} from './overheatable-device';

export class ShellyEM extends OverheatableDevice {
  constructor(adapter: Adapter, id: string) {
    super(adapter, id);
    this.addPowermeters(2);
  }
}
