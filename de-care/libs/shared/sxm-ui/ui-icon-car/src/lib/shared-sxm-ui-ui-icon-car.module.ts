import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg stroke="currentColor" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M18.9,12.2l-4.7,13.4L9,32.1 c-0.6,0.7-0.9,1.6-0.9,2.5v8.6c0,1.4,0.8,2.8,2.1,3.4l0.4,0.2c2.1,1.1,4.4,1.6,6.8,1.6H47c2.4,0,4.7-0.6,6.8-1.6l0.4-0.2 c1.3-0.6,2.1-2,2.1-3.4v-8.6c0-0.9-0.3-1.8-0.9-2.5l-5.2-6.6l-4.7-13.4c0,0-4.7-1-13.2-1S18.9,12.2,18.9,12.2z"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M18.5,48.5v3.4c0,0.3-0.1,0.5-0.3,0.7l-0.4,0.4 c-0.2,0.2-0.4,0.3-0.7,0.3h-6.4c-0.5,0-1-0.2-1.3-0.6l-0.8-0.8c-0.4-0.4-0.6-0.8-0.6-1.3v-8.8"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M45.8,48.5v3.4c0,0.3,0.1,0.5,0.3,0.7l0.4,0.4 c0.2,0.2,0.4,0.3,0.7,0.3h6.4c0.5,0,1-0.2,1.3-0.6l0.8-0.8c0.4-0.4,0.6-0.8,0.6-1.3v-8.8"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M22.3,41.8L22.3,41.8c0-2.3-1.4-4.3-3.6-5.1 l-6.9-2.4c-0.6-0.1-1.2-0.1-1.8,0.1l-1.9,0.7v3.8l2.5,1.3c2.1,1.1,4.4,1.6,6.8,1.6H47c2.4,0,4.7-0.6,6.8-1.6l2.5-1.3v-3.8 l-1.9-0.7c-0.6-0.2-1.2-0.2-1.8-0.1l-6.9,2.4c-2.1,0.8-3.6,2.8-3.6,5.1v0"/>
  <line fill="none" stroke-width="2" stroke-miterlimit="10" x1="14.2" y1="25.5" x2="50.1" y2="25.5"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M48.6,21.2l6.6,0.1c1.2,0.2,2.2,1.2,2.2,2.5v1.7 c0,0.6-0.4,1.1-1,1.2l-4.4,1.1"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M15.7,21.2l-6.6,0.1C7.9,21.5,7,22.5,7,23.8v1.7 c0,0.6,0.4,1.1,1,1.2l4.4,1.1"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M45.8,25.3c-0.4-1.2-1.2-2.3-2.2-3.1 c-1-0.8-2.2-1.2-3.6-1.3s-2.6,0.4-3.6,1.1s-1.8,1.7-2.3,3"/>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconCarModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('car', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
