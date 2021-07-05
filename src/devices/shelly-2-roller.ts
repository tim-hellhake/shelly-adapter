/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Adapter} from 'gateway-addon';
import {ShellyController} from '../shelly-controller';
import {RollerPositionProperty} from '../properties/roller-position-property';
import {OverheatableDevice} from './overheatable-device';

export class Shelly2Roller extends OverheatableDevice {
  // eslint-disable-next-line no-unused-vars
  constructor(adapter: Adapter, id: string, private controller: ShellyController) {
    super(adapter, id);
    this.configureRollerMode();
  }

  protected configureRollerMode(): void {
    const rollerPositionProperty = new RollerPositionProperty(
      this, 'rollerPosition', 'Opening level in %', (value) => {
        this.controller.setRollerPosition(value).catch((reason) => {
          console.log(reason);
        });
      });

    this.addProperty(rollerPositionProperty);

    this.addCallbackAction('open', {
      title: 'Open',
    }, () => {
      this.controller.setRollerState('open');
    });

    this.addCallbackAction('stop', {
      title: 'Stop',
    }, () => {
      this.controller.setRollerState('stop');
    });

    this.addCallbackAction('close', {
      title: 'Close',
    }, () => {
      this.controller.setRollerState('close');
    });
  }
}
