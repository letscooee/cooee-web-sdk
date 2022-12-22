export class Spacing {

    readonly pl: number; // padding from left
    readonly pr: number; // padding from right
    readonly pt: number; // padding from top
    readonly pb: number; // padding from bottom

    constructor(data?: Partial<Spacing>) {
        data = data ?? {};
        this.pl = data.pl ?? 0;
        this.pr = data.pr ?? 0;
        this.pt = data.pt ?? 0;
        this.pb = data.pb ?? 0;
    }

    getHorizontal(): number {
        return this.pl + this.pr;
    }

    getVertical(): number {
        return this.pt + this.pb;
    }

    getPaddingCSS(): string {
        return `${this.pt}px ${this.pr}px ${this.pb}px ${this.pl}px`;
    }

}
