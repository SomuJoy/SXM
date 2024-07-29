import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 17">
    <g stroke-width="1" stroke="currentColor" fill="none" fill-rule="evenodd">
        <g transform="translate(-454.000000, -1453.000000)" stroke-width="2">
            <g transform="translate(56.000000, 1426.000000)">
                <g transform="translate(399.000000, 28.000000)">
                    <polyline transform="translate(13.763230, 7.263230) scale(-1, 1) rotate(-270.000000) translate(-13.763230, -7.263230)" points="6.5 3.58658737 13.6731747 10.939872 21.0264594 3.58658737"></polyline>
                    <line x1="0" y1="7.08658737" x2="17" y2="7"></line>
                </g>
            </g>
        </g>
    </g>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconRightArrowModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('right-arrow', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
