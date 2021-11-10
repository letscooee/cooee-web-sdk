import {Colour} from './colour';

export interface Border {

    readonly style: 'SOLID' | 'DASHED';
    readonly radius?: number;
    readonly width?: number;
    readonly dashWidth?: string;
    readonly dashGap?: string;
    readonly colour?: Colour;

}
