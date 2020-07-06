import {faFacebookSquare, faInstagram, faLinkedin} from '@fortawesome/free-brands-svg-icons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';

export function loadFontAwesomeExplicitFonts(library: FaIconLibrary) {
    library.addIcons(faFacebookSquare);
    library.addIcons(faLinkedin);
    library.addIcons(faInstagram);
}
