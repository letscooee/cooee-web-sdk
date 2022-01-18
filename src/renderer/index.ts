import {Constants} from '../constants';

export {TextRenderer} from './text-renderer';
export {ShapeRenderer} from './shape-renderer';
export {ImageRenderer} from './image-renderer';
export {RootContainerRenderer} from './root-container-renderer';
export {IFrameRenderer} from './iFrame-renderer';

/**
 * Calculate scaling factor according to screen sizes
 * @return number scaling factor
 */
export function getScalingFactor(): number {
    const screenWidth = document.documentElement.clientWidth;
    const screenHeight = document.documentElement.clientHeight;

    let scalingFactor;
    if (screenWidth < screenHeight) {
        const shortEdge = Math.min(Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
        scalingFactor = screenWidth / shortEdge;
    } else {
        const longEdge = Math.max(Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
        scalingFactor = screenHeight / longEdge;
    }

    // The in-app should not scale beyond 100%
    return Math.min(scalingFactor, 1);
}
