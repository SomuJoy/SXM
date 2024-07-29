import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 32">
    <g stroke-width="1" stroke="currentColor" fill="none" fill-rule="evenodd">
        <g transform="translate(-4.000000, -4.000000)" stroke-width="1.245">
              <g transform="translate(4.980000, 4.980000)">
                  <g>
                      <path d="M4.70533738,20.6429294 L0.804269975,20.6429294 C0.360083933,20.6429294 0,20.2828454 0,19.8386594 L0,0.804269975 C0,0.360083933 0.360083933,0 0.804269975,0 L26.4068642,0 C26.8510502,0 27.2111341,0.360083933 27.2111341,0.804269975 L27.2111341,4.67698444 L27.2111341,4.67698444"></path>
                      <path d="M15.8186115,25.3345042 L5.62988982,25.3345042 C5.11167278,25.3345042 4.69157485,24.9144063 4.69157485,24.3961892 L4.69157485,5.62988982 C4.69157485,5.11167278 5.11167278,4.69157485 5.62988982,4.69157485 L30.964394,4.69157485 C31.4826111,4.69157485 31.902709,5.11167278 31.902709,5.62988982 L31.902709,12.865" stroke-linecap="round"></path>
                      <g transform="translate(8.444835, 13.072508)" stroke-linecap="round">
                          <line x1="-1.37608443e-14" y1="0.592777608" x2="9.68333333" y2="0.592777608"></line>
                          <line x1="1.89211609e-14" y1="5.00537423" x2="4.93849991" y2="5.00537423"></line>
                      </g>
                      <line x1="8.44483474" y1="8.74122354" x2="11.4079347" y2="8.74122354" stroke-linecap="round"></line>
                  </g>
                  <g transform="translate(17.936300, 13.827800)">
                      <path d="M15.6787004,7.95970026 C15.6787004,12.1998738 12.2402771,15.6372003 8.00120035,15.6372003 C3.76102678,15.6372003 0.323700351,12.1998738 0.323700351,7.95970026 C0.323700351,3.71952669 3.76102678,0.282200259 8.00120035,0.282200259 C12.2402771,0.282200259 15.6787004,3.71952669 15.6787004,7.95970026 Z"></path>
                      <line x1="4.47370035" y1="8.16720026" x2="11.9437004" y2="8.16720026" stroke-linecap="round"></line>
                      <line x1="8.15811952" y1="11.9323992" x2="8.15811952" y2="4.46239922" stroke-linecap="round"></line>
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
export class SharedSxmUiUiIconAdditionalSubscriptionsModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('additional-subscriptions', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
