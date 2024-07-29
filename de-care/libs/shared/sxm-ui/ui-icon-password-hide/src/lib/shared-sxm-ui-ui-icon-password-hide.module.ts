import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M15,3 L16.7320508,4 L7.73205081,19.5884573 L6,18.5884573 L6.99450628,16.8646027 C5.0459244,15.881498 3.38108897,14.2599638 2,12 C4.44444444,8 7.77777778,6 12,6 C12.4199442,6 12.8310952,6.01978477 13.233453,6.05935432 L15,3 Z M16.6091146,6.94598758 C18.7292093,7.90360925 20.5261711,9.58828006 22,12 C19.5555556,16 16.2222222,18 12,18 C11.4139325,18 10.8449911,17.9614661 10.2931759,17.8843982 L11.3913361,15.9832107 C11.591482,15.994416 11.7943567,16 12,16 C15.1252321,16 17.6110498,14.7103277 19.596597,12 C18.443156,10.4255207 17.1208907,9.33046462 15.6025231,8.68915375 L16.6091146,6.94598758 Z M8.87263196,8.50585247 C7.15318998,9.11004503 5.67560662,10.2634064 4.40340302,12 C5.45424246,13.4344253 6.64520737,14.4709258 7.99692463,15.1289186 L8.91177298,13.5423919 C8.34212825,12.8512441 8,11.9655762 8,11 C8,10.056746 8.32649242,9.18974838 8.87263196,8.50585247 Z M15.4441514,8.96460198 C15.7972941,9.56087739 16,10.2567664 16,11 C16,13.209139 14.209139,15 12,15 L11.959,14.999 L15.4441514,8.96460198 Z" fill-rule="nonzero"></path>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconPasswordHideModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('password-hide', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
