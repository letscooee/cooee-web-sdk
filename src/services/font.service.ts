import {FontDetails, FontFamily} from '../models/trigger/blocks/font-family';
import {BaseElement, TextElement} from '../models/trigger/elements';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';

/**
 * A utility service to load and handle the fonts.
 *
 * @author Shashank Agrawal
 */
export class FontService {

    private loadedFonts: string[] = [];

    async loadAllFonts(inApp: InAppTrigger): Promise<void> {
        inApp.elems?.forEach((element: BaseElement) => {
            if (element instanceof TextElement) {
                this.loadFamily(element.font.family);
            }
        });
    }

    /**
     * Load the given font family if not already loaded.
     *
     * @param family
     */
    private async loadFamily(family: FontFamily): Promise<void> {
        if (!family?.fonts) {
            return;
        }

        // Prevent loading the same fonts multiple times
        if (this.loadedFonts.indexOf(family.name) > -1) {
            return;
        }

        const promises: Promise<any>[] = [];

        family.fonts.forEach((font: FontDetails) => {
            if (font.url) {
                const myFont = new FontFace(family.name, font.getURL(), font.getFontDescriptor());
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

}
