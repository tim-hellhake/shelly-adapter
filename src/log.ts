/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

let debugLogsActive = false;

export function debugLogs(active: boolean): void {
  debugLogsActive = active;
}

export function debug(message?: unknown, ...optionalParams: unknown[]): void {
  if (debugLogsActive) {
    console.log(message, ...optionalParams);
  }
}
