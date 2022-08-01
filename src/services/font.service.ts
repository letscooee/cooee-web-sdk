import {AVAILABLE_FONT_FAMILIES} from '../models/trigger/blocks/fonts';
import {BaseElement, TextElement} from '../models/trigger/elements';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';
import {FontDetails, FontFamily} from '../models/trigger/blocks/font-family';

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

        family.fonts.forEach((font: FontDetails) => {
            const myFont = new FontFace(family.name, font.getURLs(), font.getFontDescriptor());
            promises.push(myFont.load());
        });

        this.loadedFonts.push(family.name);

        const loadedFonts = await Promise.all(promises);
        loadedFonts.forEach((font) => {
            // @ts-ignore
            document.fonts.add(font);
        });
    }

    /**
     * Load a font-family from the given name by looking it into the default/available fonts and app's custom fonts.
     *
     * @param name The name of the font.
     */
    async loadFamilyByName(name: string): Promise<void> {
        const family = await this.findFamilyByName(name);
        if (!family) {
            console.log('No font family found with name %s', name);
            return;
        }

        await this.loadFamily(family);
    }

    loadAllFonts(inApp: InAppTrigger): void {
        inApp?.elems?.forEach(async (element: BaseElement) => {
            if (element instanceof TextElement) {
                await this.loadFamilyByName(element.font.ff);
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    private findFamilyByName(name: string): FontFamily | null {
        const family = AVAILABLE_FONT_FAMILIES.find((item) => item.name === name);
        if (family) {
            return family;
        }

        // TODO find from the custom fonts
        return null;
    }

}
