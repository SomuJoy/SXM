import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -5 22 27">
    <path d="M10,-1 C16.0752847,-1 21,3.92471525 21,10 C21,16.0752847 16.0752847,21 10,21 C3.92471525,21 -1,16.0752847 -1,10 C-1,3.92471525 3.92471525,-1 10,-1 Z M17.0323553,4.38276024 L4.38276024,17.0323553 C5.92234177,18.2637177 7.87515579,19 10,19 C14.9707153,19 19,14.9707153 19,10 C19,7.87515579 18.2637177,5.92234177 17.0323553,4.38276024 Z M10,1 C5.02928475,1 1,5.02928475 1,10 C1,12.1248442 1.73628233,14.0776582 2.9676447,15.6172398 L15.6172398,2.9676447 C14.0776582,1.73628233 12.1248442,1 10,1 Z" fill-rule="nonzero"></path>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconErrorModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('error', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
