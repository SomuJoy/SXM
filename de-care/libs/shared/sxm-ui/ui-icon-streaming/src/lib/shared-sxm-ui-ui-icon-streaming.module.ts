import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M61,44H47V28c0-1.1-0.9-2-2-2h-3V13 c0-1.1,0.9-2,2-2h17c1.1,0,2,0.9,2,2v29C63,43.1,62.1,44,61,44z"/>
  <circle fill="none" stroke-width="2" stroke-miterlimit="10" cx="52.5" cy="20.5" r="2.5"/>
  <circle fill="none" stroke-width="2" stroke-miterlimit="10" cx="52.5" cy="34.5" r="5.5"/>
  <g>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M33,44H5L4.7,22.1c0-1.1,0.9-2,2-2H35 c1.1,0,2,0.9,2,2V26h-2c-1.1,0-2,0.9-2,2L33,44z"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M33,49L3,48.9c-1.1,0-2-0.9-2-2V44h32V49z"/>
  </g>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M45,52H35c-1.1,0-2-0.9-2-2V28c0-1.1,0.9-2,2-2h10 c1.1,0,2,0.9,2,2v22C47,51.1,46.1,52,45,52z"/>
  <circle stroke="none" cx="40" cy="48" r="1"/>
  <g>
    <line fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="38" y1="30" x2="42" y2="30"/>
  </g>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconStreamingModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('streaming', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
