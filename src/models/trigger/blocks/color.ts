import {Gradient} from './gradient';
import hexRgb from 'hex-rgb';

export class Color {

    /**
     * The six digit (excluding #) hex string.
     */
    h: string;

    /**
     * The alpha/transparency
     */
    a?: number = 100;

    /**
     * The gradient colors
     */
    g?: Gradient;

    constructor(props: Record<string, any>) {
        this.h = props.h;
        this.a = props.a;
        this.g = props.g as Gradient;
    }

    get hex(): string {
        return this.h;
    }

    get grad(): Gradient | undefined {
        return this.g;
    }

    get rgba(): string {
        if (!this.hex) {
            return '';
        }

        try {
            return hexRgb(this.hex, {format: 'css', alpha: this.getAlpha()});
        } catch (e) {
            console.error('Invalid hex', e);
            return '#000000';
        }
    }

    private getAlpha(): number {
        return (this.a ?? 100) / 100;
    }

}

