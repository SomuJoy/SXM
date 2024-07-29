import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12,6 C16.2222222,6 19.5555556,8 22,12 C19.5555556,16 16.2222222,18 12,18 C7.77777778,18 4.44444444,16 2,12 C4.44444444,8 7.77777778,6 12,6 Z M15.1272458,8.50546155 L15.1378385,8.51902035 C15.6776779,9.20086139 16,10.0627895 16,11 C16,13.209139 14.209139,15 12,15 C9.790861,15 8,13.209139 8,11 C8,10.056746 8.32649242,9.18974838 8.87263196,8.50585247 C7.15318998,9.11004503 5.67560662,10.2634064 4.40340302,12 C6.38895023,14.7103277 8.87476789,16 12,16 C15.1252321,16 17.6110498,14.7103277 19.596597,12 C18.3243934,10.2634064 16.84681,9.11004503 15.1272458,8.50546155 Z" fill-rule="nonzero"></path>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconPasswordShowModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('password-show', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
