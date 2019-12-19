/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

declare module 'shellies' {
    function on(type: 'discover', listener: (device: Shelly) => void): void;
    function start(): any;

    class Shelly {
        public id: string;
        public name: string;
        public relay0: boolean;

        public on(type: 'change', listener: (prop: string, newValue: any, oldValue: any) => void): void;
        public setRelay(index: number, value: boolean): Promise<void>
        public setWhite(brightness: number, on: boolean): Promise<void>
    }
}
