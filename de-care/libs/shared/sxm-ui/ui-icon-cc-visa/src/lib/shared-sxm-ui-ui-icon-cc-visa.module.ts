import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 60">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill-rule="nonzero">
            <rect fill="#FFFFFF" x="0" y="0.9" width="93.2" height="58.2"></rect>
            <rect fill="#F0B21C" x="0" y="50.7" width="93.2" height="8.4"></rect>
            <rect fill="#292D6A" x="0" y="1" width="93.2" height="8.4"></rect>
            <path d="M37.3,18.5 L27.7,41.5 L21.5,41.5 L16.8,23.2 C16.7,22.3 16.2,21.6 15.4,21.2 C13.5,20.3 11.6,19.7 9.5,19.2 L9.6,18.5 L19.7,18.5 C21.1,18.5 22.2,19.5 22.5,20.8 L25,34.1 L31.2,18.5 L37.3,18.5 Z M61.9,34 C61.9,27.9 53.5,27.6 53.6,24.9 C53.6,24.1 54.4,23.2 56.1,23 C58.1,22.8 60.1,23.1 62,24 L63,19.1 C61.2,18.4 59.3,18.1 57.4,18.1 C51.5,18.1 47.4,21.2 47.4,25.7 C47.4,29 50.4,30.9 52.6,32 C54.8,33.1 55.7,33.9 55.7,34.9 C55.7,36.4 53.8,37.1 52.2,37.1 C50.1,37.1 48,36.6 46.1,35.6 L45,40.6 C47.1,41.4 49.4,41.8 51.6,41.8 C57.8,41.8 61.9,38.7 61.9,34 L61.9,34 Z M77.5,41.5 L83,41.5 L78.2,18.5 L73.1,18.5 C72,18.5 71,19.2 70.6,20.2 L61.7,41.5 L67.9,41.5 L69.1,38.1 L76.7,38.1 L77.5,41.5 Z M70.8,33.3 L73.9,24.7 L75.7,33.3 L70.8,33.3 Z M45.8,18.5 L40.9,41.5 L35,41.5 L39.9,18.5 L45.8,18.5 Z" fill="#292D6A"></path>
        </g>
    </g>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconCcVisaModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('cc-visa', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
