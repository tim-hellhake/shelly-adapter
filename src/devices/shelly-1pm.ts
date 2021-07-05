/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Adapter} from 'gateway-addon';
import {ShellyController} from '../shelly-controller';
import {Shelly1} from './shelly-1';

export class Shelly1PM extends Shelly1 {
  constructor(adapter: Adapter, id: string, controller: ShellyController) {
    super(adapter, id, controller);
    this.addPowermeters(1);
  }
}
