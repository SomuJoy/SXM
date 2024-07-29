import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 16">
    <g fill="none" fill-rule="evenodd">
        <path fill="currentColor" fill-rule="nonzero" d="M.5 7.435h13v8.5H.5z"></path>
        <path stroke="currentColor" stroke-width="2" d="M4 9.571v-5a3 3 0 1 1 6 0v5"></path>
    </g>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconLockModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('lock', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
