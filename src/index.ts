/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {AddonManagerProxy, Database} from 'gateway-addon';
import {Config} from './config';
import {debugLogs} from './log';
import {CoapShellyAdapter} from './coap/coap-shelly-adapter';

export = async function(addonManager: AddonManagerProxy,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        _: unknown,
                        errorCallback:
                        // eslint-disable-next-line no-unused-vars
                        (packageName: string, error: string) => void): Promise<void> {
  const id = 'shelly-adapter';
  const db = new Database(id, '');
  await db.open();
  const config = <Config><unknown> await db.loadConfig();
  await db.close();
  debugLogs(config.debugLogs ?? false);
  new CoapShellyAdapter(addonManager, id, config, (error: string) => errorCallback(id, error));
}
