import {Constants} from '../constants';
import {Event} from '../models/event/event';
import {BaseElement, ImageElement, ShapeElement, TextElement} from '../models/trigger/elements/';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';
import {TriggerData} from '../models/trigger/trigger-data';
import {TriggerHelper} from '../models/trigger/trigger-helper';
import {FontService} from '../services/font.service';
import {SafeHttpService} from '../services/safe-http-service';
import {Log} from '../utils/log';
import {ImageRenderer, RootContainerRenderer, ShapeRenderer, TextRenderer} from './';
import {ContainerRenderer} from './container-renderer';
import {Renderer} from './renderer';
import {TriggerContext} from '../models/trigger/trigger-context';

/**
 * Renders In App trigger
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class InAppRenderer {

    private readonly renderer: Renderer = Renderer.get();
    private readonly parent: HTMLElement;
    private rootContainer: HTMLDivElement;
    private ian: InAppTrigger;
    private triggerContext: TriggerContext;
    private safeHTTP: SafeHttpService;

    /**
     * Public constructor.
     *
     * @param parent Place the in-app in the given parent instead of the document.body.
     */
    constructor(parent?: HTMLElement) {
        this.parent = parent ?? document.body;
        this.renderer.setParentContainer(this.parent);
        this.safeHTTP = SafeHttpService.getInstance();
    }

    /**
     * Renders in-app trigger from payload received
     * @param {TriggerData} triggerData {@link TriggerData}
     */
    render(triggerData: TriggerData): void {
        triggerData = new TriggerData(triggerData);

        this.triggerContext = new TriggerContext(new Date(), triggerData);

        this.triggerContext.onClose((eventProps: Record<string, any>) => {
            this.closeInApp(eventProps);
        });
        this.ian = triggerData.ian!;

        if (this.renderer.isMobile() || triggerData.previewType === 'mobile') {
            this.ian.overrideForMobileView();
        }

        this.renderer.calculateScalingFactor(this.ian);

        this.rootContainer = new RootContainerRenderer(this.parent, this.ian, this.triggerContext)
            .render() as HTMLDivElement;

        try {
            this.renderContainer(this.triggerContext);

            const event: Event = new Event(Constants.EVENT_TRIGGER_DISPLAYED, {}, this.triggerContext.triggerData);
            SafeHttpService.getInstance().sendEvent(event);

            TriggerHelper.storeActiveTrigger(triggerData);
        } catch (e) {
            Log.error(e);
        }
    }

    /**
     * Close InApp
     * @param eventProps event props sent by the close callback
     * @private
     */
    private closeInApp(eventProps: Record<string, any>): void {
        if (this.triggerContext.autoCloseTimeInterval) {
            // stop autoclose countdown timer as soon as close InApp triggers
            clearInterval(this.triggerContext.autoCloseTimeInterval);
        }

        Renderer.get().removeInApp(this.triggerContext);
        const event = new Event(Constants.EVENT_TRIGGER_CLOSED, eventProps, this.triggerContext.triggerData);
        this.safeHTTP.sendEvent(event);
    }

    /**
     * Render elements.
     * @param {HTMLElement} parentEl element to be rendered
     * @param {BaseElement} inappElement style and attributes data of the element
     * @param triggerContext
     */
    private renderElement(parentEl: HTMLElement, inappElement: BaseElement, triggerContext: TriggerContext): void {
        if (inappElement instanceof TextElement) {
            new TextRenderer(parentEl, inappElement, triggerContext).render();
        } else if (inappElement instanceof ImageElement) {
            new ImageRenderer(parentEl, inappElement, triggerContext).render();
        } else if (inappElement instanceof ShapeElement) {
            new ShapeRenderer(parentEl, inappElement, triggerContext).render();
        } else {
            Log.error('Unsupported element type- ' + inappElement.type);
        }
    }

    /**
     * Render container from {@link ian} block.
     * @param triggerContext
     * @private
     */
    private renderContainer(triggerContext: TriggerContext): void {
        const container = this.ian?.cont;
        if (!container) {
            return;
        }

        const containerHTMLElement = new ContainerRenderer(this.rootContainer, container, triggerContext)
            .render()
            .getHTMLElement();

        // noinspection JSIgnoredPromiseFromCall
        new FontService().loadAllFonts(this.ian);

        this.ian.elems?.forEach(async (element: BaseElement) => {
            await this.renderElement(containerHTMLElement, element, triggerContext);
        });

        this.addCountDownTimer(containerHTMLElement);
    }

    /**
     * Create and add Countdown timer in container
     * @param container {@link HTMLElement} in which timer should be added
     * @since 0.1.6
     * @private
     */
    private addCountDownTimer(container: HTMLElement): void {
        if (!this.ian.atcl || !this.ian.atcl.sec) {
            return;
        }

        const parentDiv = this.renderer.createElement('div');
        const containerWidth = this.renderer.getStyle(container, 'width');

        this.addElementStyles(parentDiv, {
            'width': containerWidth,
            'height': this.renderer.getStyle(container, 'height'),
            'display': 'flex',
        });

        const timerDiv = this.renderer.createElement('div');
        this.addElementStyles(timerDiv, {
            'width': containerWidth,
            'align-self': 'flex-end',
        });

        if (this.ian.atcl.v) {
            this.renderer.setStyle(timerDiv, 'display', 'none');
        }

        const timerText = this.renderer.createElement('span');
        timerText.innerText = `Closes in ${this.ian.atcl.sec ?? 0} seconds`;
        this.addElementStyles(timerText, {
            'width': '30%',
            'background-color': 'black',
            'color': 'white',
            'text-align': 'center',
            'border-radius': '5px',
            'font-size': '11px',
            'padding': '3px 0px',
            'display': 'block',
            'margin-bottom': '3px',
        });

        const timerProgress = this.renderer.createElement('div');
        this.addElementStyles(timerProgress, {
            'width': containerWidth,
            'height': '5px',
            'background-color': this.ian.atcl.c ?? '#000',
            'transition': 'all 1.2s',
        });

        this.renderer.appendChild(timerDiv, timerText);
        this.renderer.appendChild(timerDiv, timerProgress);
        this.renderer.appendChild(parentDiv, timerDiv);
        this.renderer.appendChild(container, parentDiv);
        this.startCountDownTimer(timerText, timerProgress, this.ian.atcl.sec ?? 0, containerWidth.slice(0, -2));
    }

    /**
     * Starts a countdown timer and close InApp as soon as timer finished
     * @param timerText timer text
     * @param timer timer element
     * @param seconds total seconds
     * @param width container width
     * @since 0.1.6
     * @private
     */
    private startCountDownTimer(timerText: HTMLElement, timer: HTMLElement, seconds: number, width: string): void {
        let progress = Number(width);
        let remaining = seconds;
        const interval = setInterval(() => {
            if (remaining > 0) {
                remaining--;
                timerText.innerText = `Closes in ${remaining} seconds`;
                const percent = (remaining * 100) / seconds;
                progress = (percent * Number(width)) / 100;
                this.renderer.setStyle(timer, 'width', `${progress}px`);
            } else {
                this.triggerContext.setAutoCloseInterval(interval);
                this.triggerContext.closeInApp('Auto');
            }
        }, 1000);
    }

    /**
     * Loops style record and applies to element
     * @param element {@link HTMLElement} on which style should be applied.
     * @param style Record of style
     * @since: 0.1.6
     * @private
     */
    private addElementStyles(element: HTMLElement, style: Record<string, string>): void {
        Object.keys(style).forEach((key) => {
            this.renderer.setStyle(element, key, style[key]);
        });
    }

}
