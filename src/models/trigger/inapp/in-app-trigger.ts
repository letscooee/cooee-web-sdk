import {Container} from './container';
import {Layer} from './layer';

/**
 * Stores data present in ian (In App) block in {@link TriggerData}
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export interface InAppTrigger {

    container: Container;
    layers: Layer[]

}
