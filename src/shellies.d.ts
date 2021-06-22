/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

declare module 'shellies' {
    function on(type: 'discover', listener: (device: Shelly) => void): void;
    function start(networkInterface?: unknown): any;
    function setAuthCredentials(username: string, password: string): void;

    class Shelly {
        public id: string;
        public name: string;
        public deviceTemperature?: number;
        public mode?: 'relay' | 'roller';
        public rollerPosition?: number;
        public setRollerState(state: 'open' | 'stop' | 'close', duration?: number): Promise<void>;
        public setRollerPosition(position: number): Promise<void>;
        public on(type: 'change', listener: (prop: string, newValue: any, oldValue: any) => void): void;
        public setRelay(index: number, value: boolean): Promise<void>
        public setWhite(brightness: number, on: boolean): Promise<void>
        public setRollerPosition(position: number): Promise<void>
        public temperature?: number;
        public humidity?: number;
        public battery?: number;
        public state?: boolean;
        public vibration?: boolean;
        public illuminance?: number;
        public tilt?: number;
    }
}
