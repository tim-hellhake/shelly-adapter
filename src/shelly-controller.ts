/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

/* eslint-disable no-unused-vars */
export interface ShellyController {
    setRollerState(state: 'open' | 'stop' | 'close', duration?: number): Promise<void>;
    setRollerPosition(position: number): Promise<void>;
    // eslint-disable-next-line max-len
    on(type: 'change', listener: (prop: string, newValue: unknown, oldValue: unknown) => void): void;
    setRelay(index: number, value: boolean): Promise<void>
    setWhite(brightness: number, on: boolean): Promise<void>
}
