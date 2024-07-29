import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 59">
    <defs>
        <linearGradient x1="75.5242857%" y1="90.27%" x2="40.8814286%" y2="36.0557143%" id="icon-cc-discover-lg-1">
            <stop stop-color="#F79E20" offset="0%"></stop>
            <stop stop-color="#F79920" offset="25%"></stop>
            <stop stop-color="#F58C20" offset="53%"></stop>
            <stop stop-color="#F58620" offset="62%"></stop>
            <stop stop-color="#F48121" offset="71%"></stop>
            <stop stop-color="#F17522" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="70.06%" y1="89.5407143%" x2="19.4171429%" y2="-9.38785714%" id="icon-cc-discover-lg-2">
            <stop stop-color="#F58620" stop-opacity="0" offset="0%"></stop>
            <stop stop-color="#EE7E22" stop-opacity="0.14" offset="11%"></stop>
            <stop stop-color="#E37226" stop-opacity="0.35" offset="31%"></stop>
            <stop stop-color="#DB6828" stop-opacity="0.52" offset="50%"></stop>
            <stop stop-color="#D5622A" stop-opacity="0.64" offset="69%"></stop>
            <stop stop-color="#D15D2C" stop-opacity="0.71" offset="85%"></stop>
            <stop stop-color="#D05C2C" stop-opacity="0.74" offset="98%"></stop>
        </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill-rule="nonzero">
            <polygon fill="#FFFFFF" points="0.4 0.6 90.8 0.6 90.8 58.2 0.5 58.2"></polygon>
            <path d="M90.4,32.6 C90.4,32.6 65.7,50 20.5,57.8 L90.4,57.8 L90.4,32.6 Z" fill="#F38020"></path>
            <path d="M90.8,0.3 L0.1,0.3 L0.1,58.5 L91.1,58.5 L91.1,0.3 L90.8,0.3 Z M90.4,0.9 L90.4,57.8 L0.8,57.8 L0.8,0.9 L90.4,0.9 Z" fill="#221F1F"></path>
            <path d="M8.1,18.1 L4.3,18.1 L4.3,31.3 L8.1,31.3 C9.8,31.4 11.5,30.9 12.8,29.8 C14.3,28.5 15.2,26.7 15.2,24.7 C15.1,20.8 12.2,18.1 8.1,18.1 Z M11.1,28 C10.1,28.8 8.8,29.1 7.6,29 L6.9,29 L6.9,20.3 L7.6,20.3 C8.9,20.2 10.1,20.6 11.1,21.4 C12,22.2 12.5,23.4 12.5,24.7 C12.5,25.9 12,27.1 11.1,28 Z" fill="#221F1F"></path>
            <rect fill="#221F1F" x="16.3" y="18.1" width="2.6" height="13.2"></rect>
            <path d="M25.2,23.2 C23.7,22.6 23.2,22.3 23.2,21.6 C23.2,20.9 24,20 25.1,20 C25.9,20 26.7,20.4 27.2,21.1 L28.5,19.3 C27.4,18.4 26.1,17.8 24.6,17.8 C22.5,17.7 20.6,19.3 20.5,21.4 C20.5,21.5 20.5,21.5 20.5,21.6 C20.5,23.4 21.3,24.3 23.7,25.2 C24.3,25.4 24.9,25.6 25.5,26 C26,26.3 26.3,26.8 26.3,27.4 C26.3,28.4 25.4,29.3 24.4,29.3 C24.4,29.3 24.3,29.3 24.3,29.3 C23.1,29.3 22,28.6 21.5,27.5 L19.8,29.1 C20.7,30.7 22.5,31.7 24.3,31.6 C26.6,31.8 28.7,30 28.8,27.7 C28.8,27.6 28.8,27.4 28.8,27.3 C29,25.2 28.1,24.2 25.2,23.2 Z" fill="#221F1F"></path>
            <path d="M29.8,24.7 C29.8,28.5 32.8,31.5 36.6,31.6 C36.7,31.6 36.7,31.6 36.8,31.6 C37.9,31.6 39,31.3 40,30.8 L40,27.8 C39.2,28.7 38.1,29.2 36.9,29.2 C34.5,29.3 32.5,27.4 32.5,25 C32.5,24.9 32.5,24.8 32.5,24.6 C32.4,22.2 34.3,20.2 36.7,20.1 C36.7,20.1 36.7,20.1 36.8,20.1 C38,20.1 39.2,20.6 40,21.6 L40,18.6 C39,18.1 37.9,17.8 36.8,17.8 C33,17.8 29.8,20.9 29.8,24.7 C29.8,24.7 29.8,24.7 29.8,24.7 Z" fill="#221F1F"></path>
            <polygon fill="#221F1F" points="60.3 26.9 56.8 18.1 54 18.1 59.6 31.6 61 31.6 66.6 18.1 63.9 18.1"></polygon>
            <polygon fill="#221F1F" points="67.8 31.3 75.1 31.3 75.1 29 70.4 29 70.4 25.5 74.9 25.5 74.9 23.2 70.4 23.2 70.4 20.3 75.1 20.3 75.1 18.1 67.8 18.1"></polygon>
            <path d="M85.3,22 C85.3,19.5 83.6,18.1 80.6,18.1 L76.8,18.1 L76.8,31.3 L79.4,31.3 L79.4,26 L79.7,26 L83.3,31.3 L86.5,31.3 L82.4,25.7 C84.1,25.4 85.4,23.8 85.3,22 Z M80.1,24.2 L79.3,24.2 L79.3,20.2 L80.1,20.2 C81.7,20.2 82.6,20.9 82.6,22.2 C82.6,23.5 81.8,24.2 80.1,24.2 Z" fill="#221F1F"></path>
            <path d="M54.8,24.7 C54.8,28.6 51.7,31.7 47.8,31.7 C43.9,31.7 40.8,28.6 40.8,24.7 C40.8,20.8 43.9,17.7 47.8,17.7 C51.7,17.7 54.8,20.9 54.8,24.7 Z" fill="url(#icon-cc-discover-lg-1)"></path>
            <path d="M54.8,24.7 C54.8,28.6 51.7,31.7 47.8,31.7 C43.9,31.7 40.8,28.6 40.8,24.7 C40.8,20.8 43.9,17.7 47.8,17.7 C51.7,17.7 54.8,20.9 54.8,24.7 Z" fill="url(#icon-cc-discover-lg-2)" opacity="0.65"></path>
            <path d="M86.9,18.6 C86.9,18.4 86.7,18.2 86.5,18.2 L86.1,18.2 L86.1,19.4 L86.4,19.4 L86.4,18.9 L86.7,19.3 L87,19.3 L86.6,18.8 C86.8,18.9 86.9,18.7 86.9,18.6 Z M86.4,18.8 L86.4,18.8 L86.4,18.5 L86.4,18.5 C86.5,18.5 86.6,18.6 86.6,18.6 C86.6,18.6 86.5,18.8 86.4,18.8 L86.4,18.8 Z" fill="#221F1F"></path>
            <path d="M86.5,17.8 C85.9,17.8 85.5,18.2 85.5,18.8 C85.5,19.4 85.9,19.8 86.5,19.8 C87.1,19.8 87.5,19.4 87.5,18.8 C87.5,18.2 87.1,17.8 86.5,17.8 Z M86.5,19.6 C86,19.5 85.7,19.1 85.8,18.7 C85.8,18.3 86.1,18 86.5,18 C87,18.1 87.3,18.5 87.2,18.9 C87.2,19.3 86.9,19.6 86.5,19.6 Z" fill="#221F1F"></path>
        </g>
    </g>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconCcDiscoverModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('cc-discover', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
