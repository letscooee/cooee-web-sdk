import {Colour} from './colour';

export interface Border {

    readonly style: 'SOLID' | 'DASHED';
    readonly radius: string;
    readonly width: string;
    readonly dashWidth: string;
    readonly dashGap: string;
    readonly colour: Colour;

}
