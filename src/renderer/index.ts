import {Constants} from '../constants';

export {TextRenderer} from './text-renderer';
export {GroupRenderer} from './group-renderer';
export {ImageRenderer} from './image-renderer';
export {RootContainerRenderer} from './root-container-renderer';
export {IFrameRenderer} from './iFrame-renderer';

export function getScalingFactor(): number {
    const screenWidth = document.documentElement.clientWidth;
    const screenHeight = document.documentElement.clientHeight;

    const longEdge = Math.max(Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

    if (screenWidth < screenHeight) {
        return screenWidth / longEdge;
    } else {
        return screenHeight / longEdge;
    }
}
