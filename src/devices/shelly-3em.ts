/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Adapter} from 'gateway-addon';
import {ShellyController} from '../shelly-controller';
import {OverheatableDevice} from './overheatable-device';

export class Shelly3EM extends OverheatableDevice {
  constructor(adapter: Adapter, id: string, controller: ShellyController) {
    super(adapter, id);
    this.addRelays(1, controller);
    this.addPowermeters(3);
  }
}
