import {GroupElement} from '../elements';

export interface Container extends GroupElement {

    children: GroupElement[];
    animation: string;

}
