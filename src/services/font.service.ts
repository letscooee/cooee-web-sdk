import {BaseElement, TextElement} from '../models/trigger/elements';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';
import {FontDetails, FontFamily, FontStyle} from '../models/trigger/blocks/font-family';

/**
 * A utility service to load and handle the fonts.
 *
 * @author Shashank Agrawal
 */
export class FontService {

    private loadedFonts: string[] = [];

    /**
     * Load the given font family if not already loaded.
     *
     * @param family
     */
    async loadFamily(family: FontFamily): Promise<void> {
        // Prevent loading the same fonts multiple times
        if (this.loadedFonts.indexOf(family.name) > -1) {
            return;
        }

        const promises: Promise<any>[] = [];

        family.fonts?.forEach((font: FontDetails) => {
            if (font.url) {
                const myFont = new FontFace(family.name, this.getURL(font.url), this.getFontDescriptor(font.style));
                promises.push(myFont.load());
            }
        });

        this.loadedFonts.push(family.name);

        const loadedFonts = await Promise.all(promises);
        loadedFonts.forEach((font) => {
            // @ts-ignore
            document.fonts.add(font);
        });
    }

    async loadAllFonts(inApp: InAppTrigger): Promise<void> {
        inApp?.elems?.forEach((element: BaseElement) => {
            if (element instanceof TextElement) {
                this.loadFamily(element.font.fmly);
            }
        });
    }

    getFontDescriptor(style: FontStyle): FontFaceDescriptors {
        return {
            style: style === FontStyle.ITALICS || style === FontStyle.BOLD_ITALICS ? 'italic' : 'normal',
            weight: style === FontStyle.BOLD_ITALICS || style === FontStyle.BOLD ? '700' : '400',
        };
    }

    getURL(url: string): string {
        return `url('${url}')  format('truetype')`;
    }

}
