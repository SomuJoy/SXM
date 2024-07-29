import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g fill-rule="evenodd" transform="translate(4 4)">
        <circle cx="8" cy="8" r="7.5" fill-rule="nonzero"></circle>
        <path stroke="currentColor" fill="none" d="M8 10V8.602c0-.366.405-.688.54-.772.793-.492 1.46-.974 1.46-1.872C10 4.877 9.105 4 8 4s-2 .877-2 1.958"></path>
        <circle cx="8" cy="11.75" r="1" fill="currentColor" stroke="none"></circle>
    </g>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconToolTipModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('tool-tip', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
