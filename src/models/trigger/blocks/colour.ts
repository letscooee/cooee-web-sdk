import {Gradient} from './gradient';

export interface Colour {

    readonly hex?: string;
    readonly alpha?: number;
    readonly grad?: Gradient;

}
