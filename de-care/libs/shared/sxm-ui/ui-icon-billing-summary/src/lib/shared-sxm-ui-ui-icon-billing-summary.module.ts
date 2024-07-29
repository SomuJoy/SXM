import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 36">
      <g stroke-width="1" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round">
          <g transform="translate(-11.000000, -2.000000)" stroke-width="1.245">
              <g transform="translate(11.620000, 3.320000)">
                  <path d="M0.83,34.0586207 L26.5946489,34.0586207 C27.0530452,34.0586207 27.4246489,33.687017 27.4246489,33.2286207 L27.4246489,0.0510114139 L27.4246489,0.0510114139 L23.9965678,2.93169045 L20.5684867,0 L17.1404056,2.93169045 L13.7123245,0 L10.2842433,2.93169045 L6.85616223,0 L3.42808111,2.93169045 L0,0.0510114139 L0,33.2286207 C5.61373613e-17,33.687017 0.371603658,34.0586207 0.83,34.0586207 Z" stroke-linejoin="round"></path>
                  <line x1="19.5136925" y1="12.7720369" x2="19.5136925" y2="14.9007007"></line>
                  <path d="M16.876707,22.0852575 C16.876707,23.4078288 18.0583833,24.4796877 19.5140411,24.4796877 C20.970396,24.4796877 22.150678,23.4078288 22.150678,22.0852575 C22.150678,20.7620531 20.970396,19.6908273 19.5140411,19.6908273 C18.0583833,19.6908273 16.876707,18.6177022 16.876707,17.295764 C16.876707,15.9731927 18.0583833,14.9007007 19.5140411,14.9007007 C20.970396,14.9007007 22.150678,15.9731927 22.150678,17.295764" stroke-linejoin="round"></path>
                  <line x1="19.5136925" y1="25.0118537" x2="19.5136925" y2="27.1405175"></line>
                  <line x1="5.27397094" y1="9.43923488" x2="20.9427061" y2="9.43923488"></line>
                  <line x1="5.27397094" y1="13.7687206" x2="12.6575303" y2="13.7687206"></line>
                  <line x1="5.27397094" y1="18.0982062" x2="10.5479419" y2="18.0982062"></line>
                  <line x1="5.27397094" y1="22.4276919" x2="10.5479419" y2="22.4276919"></line>
                  <line x1="5.27397094" y1="26.6083515" x2="12.6575303" y2="26.6083515"></line>
              </g>
          </g>
      </g>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconBillingSummaryModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('billing-summary', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
