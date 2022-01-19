import {Constants} from '../constants';
import {Renderer} from './renderer';

export {TextRenderer} from './text-renderer';
export {ShapeRenderer} from './shape-renderer';
export {ImageRenderer} from './image-renderer';
export {RootContainerRenderer} from './root-container-renderer';
export {IFrameRenderer} from './iFrame-renderer';

/**
 * Calculate scaling factor according to parent most container where the in-app's root container will be rendered.
 * @return number scaling factor
 */
export function getScalingFactor(): number {
    const screenWidth = Renderer.get().getWidth();
    const screenHeight = Renderer.get().getHeight();

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
