import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12.004 1c6.076 0 11 4.925 11 11s-4.924 11-11 11c-6.075 0-11-4.925-11-11s4.925-11 11-11zm0 2a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9zm1 7v6h1v2h-3v-6h-1v-2h3zm0-4v2h-2V6h2z" fill-rule="nonzero" stroke="none"></path>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconInfoModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('info', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
