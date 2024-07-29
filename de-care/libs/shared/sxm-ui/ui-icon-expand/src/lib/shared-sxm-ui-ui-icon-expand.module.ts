import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
    <path d="M0 6h14v2H0z"></path>
    <path d="M8 0v14H6V0z"></path>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconExpandModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('expand', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
