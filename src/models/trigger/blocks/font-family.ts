export class FontFamily {

    name: string;
    fonts: FontDetails[];

    constructor(data?: Record<string, any>) {
        data = data ?? {};
        this.name = data.name;
        this.fonts = data.fonts?.map((item: Record<string, any>[]) => new FontDetails(item));
    }

}

export class FontDetails {

    style: FontStyle;
    url: string;

    constructor(data?: Record<string, any>) {
        data = data ?? {};
        this.style = data.style;
        this.url = data.url;
    }

    getFontDescriptor(): FontFaceDescriptors {
        return {
            style: this.style === FontStyle.ITALICS || this.style === FontStyle.BOLD_ITALICS ? 'italic' : 'normal',
            weight: this.style === FontStyle.BOLD_ITALICS || this.style === FontStyle.BOLD ? '700' : '400',
        };
    }

    getURLs(): string {
        return `url('${this.url}') format('truetype')`;
    }

}

export enum FontStyle {

    REGULAR = 1,
    ITALICS = 2,
    BOLD = 3,
    BOLD_ITALICS = 4,

}
