import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 9">
    <path d="M1.343 1.172L7 6.828l5.657-5.656" stroke="currentColor" stroke-width="2" fill="none" fill-rule="evenodd"></path>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconDropdownArrowSmallModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('dropdown-arrow-small', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
