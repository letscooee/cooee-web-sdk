import {Colour} from './colour';

export interface Glossy {

    readonly radius: number;
    readonly sampling?: number; // used in Android SDK
    readonly colour?: Colour;

}
