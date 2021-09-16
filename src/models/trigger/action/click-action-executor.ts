import {ClickAction} from '../blocks';
import {Renderer} from '../../../renderer/renderer';

/**
 * Performs click to action on in-app elements
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class ClickActionExecutor {

    private readonly action: ClickAction;

    /**
     * Constructor
     * @param {ClickAction} action action data
     */
    constructor(action: ClickAction) {
        this.action = action;
    }

    /**
     * Execute CTAs on element click event
     */
    execute(): void {
        // TODO Add CTAs.
        // Temporary
        this.externalAction();

        if (this.action.kv) {
            // TODO Send key-value to client
        }

        if (this.action.up) {
            // TODO Send user property back to server
        }

        if (this.action.prompts) {
            // TODO Ask for location and/or push notification permission
        }

        this.closeAction();
    }

    /**
     * Performs external action where url is opened in new tab/window.
     */
    externalAction(): void {
        if (this.action.external) {
            window.open(this.action.external.url, '_blank')?.focus();
        }
    }

    /**
     * Performs close action
     */
    closeAction(): void {
        if (this.action.close) {
            new Renderer().removeInApp();
        }
    }

}
