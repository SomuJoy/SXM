import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
    <g fill-rule="evenodd">
      <path d="M1.879.464l5.657 5.657L6.12 7.536.464 1.879z"></path>
      <path d="M.464 6.121L6.121.464 7.536 1.88 1.879 7.536z"></path>
    </g>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconRemoveModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('remove', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
