import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
    <g stroke="currentColor" fill="none" fill-rule="evenodd">
        <g transform="translate(1.000000, 1.000000)" fill-rule="nonzero">
            <line x1="-0.694444444" y1="5" x2="10.6944444" y2="5" transform="translate(5.000000, 5.000000) rotate(-45.000000) translate(-5.000000, -5.000000) "></line>
            <line x1="-0.694444444" y1="5" x2="10.6944444" y2="5" transform="translate(5.000000, 5.000000) scale(-1, 1) rotate(-45.000000) translate(-5.000000, -5.000000) "></line>
        </g>
    </g>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconXMarkModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('x-mark', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
