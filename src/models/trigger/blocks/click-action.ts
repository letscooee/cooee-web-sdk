import {Props} from '../../../types';

export interface ClickAction {

    readonly iab: Props;
    readonly ext: Props;
    readonly prompt: Permission;
    readonly up: Props;
    readonly kv: Props;
    readonly share: Props;
    readonly close: boolean;

}

export enum Permission {
    // eslint-disable-next-line no-unused-vars
    Location = 'LOCATION',
    // eslint-disable-next-line no-unused-vars
    Push = 'PUSH',
    // eslint-disable-next-line no-unused-vars
    Camera = 'CAMERA'
}
