import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 59">
    <defs>
        <linearGradient x1="-29.0904028%" y1="49.7891628%" x2="264.387433%" y2="49.7891628%" id="icon-cc-jcb-lg-1">
            <stop stop-color="#007F49" offset="0%"></stop>
            <stop stop-color="#219248" offset="29%"></stop>
            <stop stop-color="#51AE47" offset="77%"></stop>
            <stop stop-color="#63B946" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="9.91997573%" y1="50.219519%" x2="110.632597%" y2="50.219519%" id="icon-cc-jcb-lg-2">
            <stop stop-color="#007F49" offset="0%"></stop>
            <stop stop-color="#219248" offset="29%"></stop>
            <stop stop-color="#51AE47" offset="77%"></stop>
            <stop stop-color="#63B946" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="-29.6012163%" y1="49.2690976%" x2="284.293608%" y2="49.2690976%" id="icon-cc-jcb-lg-3">
            <stop stop-color="#007F49" offset="0%"></stop>
            <stop stop-color="#219248" offset="29%"></stop>
            <stop stop-color="#51AE47" offset="77%"></stop>
            <stop stop-color="#63B946" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="8.85007282%" y1="50.2191992%" x2="111.043762%" y2="50.2191992%" id="icon-cc-jcb-lg-4">
            <stop stop-color="#323477" offset="0%"></stop>
            <stop stop-color="#30387B" offset="5%"></stop>
            <stop stop-color="#1565AB" offset="68%"></stop>
            <stop stop-color="#0B77BD" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="8.35104369%" y1="50.2894391%" x2="107.637451%" y2="50.2894391%" id="icon-cc-jcb-lg-5">
            <stop stop-color="#753237" offset="0%"></stop>
            <stop stop-color="#A7293E" offset="38%"></stop>
            <stop stop-color="#D72144" offset="80%"></stop>
            <stop stop-color="#E91E47" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill-rule="nonzero">
            <rect fill="#FFFFFF" x="0.2" y="0.5" width="92.7" height="57.7"></rect>
            <path d="M92.7,0.7 L92.7,57.9 L0.5,57.9 L0.5,0.7 L92.7,0.7 L92.7,0.7 Z M93.2,0.2 L0,0.2 L0,58.4 L93.2,58.4 L93.2,0.2 Z" fill="#BFBEBE"></path>
            <path d="M63.5,34.7 L68.3,34.7 C68.5,34.7 68.7,34.7 68.9,34.7 C70.1,34.4 70.8,33.2 70.5,32 C70.3,31.2 69.7,30.6 68.9,30.4 C68.7,30.4 68.5,30.4 68.3,30.4 L63.5,30.4 L63.5,34.7 Z" fill="url(#icon-cc-jcb-lg-1)"></path>
            <path d="M67.8,4.2 C63.2,4.2 59.5,7.9 59.4,12.5 C59.4,12.5 59.4,12.5 59.4,12.5 L59.4,21.2 L71.2,21.2 C71.5,21.2 71.8,21.2 72,21.2 C74.7,21.3 76.6,22.7 76.6,25.1 C76.6,27 75.2,28.6 72.8,28.9 L72.8,29 C75.5,29.2 77.6,30.7 77.6,33 C77.6,35.5 75.3,37.2 72.3,37.2 L59.4,37.2 L59.4,54.2 L71.6,54.2 C76.2,54.2 80,50.5 80,45.8 L80,45.8 L80,4.1 L67.8,4.1 L67.8,4.2 Z" fill="url(#icon-cc-jcb-lg-2)"></path>
            <path d="M70,25.8 C70,24.8 69.3,24 68.3,23.8 L67.8,23.8 L63.4,23.8 L63.4,27.9 L67.8,27.9 L68.3,27.9 C69.4,27.7 70.1,26.8 70,25.8 Z" fill="url(#icon-cc-jcb-lg-3)"></path>
            <path d="M21.6,4.2 C17,4.2 13.3,7.9 13.2,12.5 C13.2,12.5 13.2,12.5 13.2,12.5 L13.2,33.1 C15.4,34.3 17.9,34.9 20.4,35 C23.3,35 24.9,33.2 24.9,30.9 L24.9,21.2 L32.1,21.2 L32.1,30.9 C32.1,34.7 29.8,37.7 21.8,37.7 C18.9,37.7 16,37.4 13.2,36.7 L13.2,54.3 L25.4,54.3 C30,54.3 33.8,50.6 33.8,45.9 L33.8,45.9 L33.8,4.1 L21.6,4.1 L21.6,4.2 Z" fill="url(#icon-cc-jcb-lg-4)"></path>
            <path d="M44.7,4.2 C40.1,4.2 36.4,7.9 36.4,12.5 C36.4,12.5 36.4,12.5 36.4,12.5 L36.4,23.4 C38.5,21.6 42.2,20.5 48.1,20.7 C50.3,20.8 52.5,21.2 54.7,21.7 L54.7,25.2 C52.7,24.2 50.6,23.5 48.4,23.4 C43.9,23.1 41.2,25.3 41.2,29.2 C41.2,33.1 43.9,35.3 48.4,35 C50.6,34.8 52.8,34.2 54.7,33.1 L54.7,36.6 C52.5,37.1 50.4,37.5 48.1,37.6 C42.2,37.9 38.5,36.7 36.4,34.9 L36.4,54.2 L48.6,54.2 C53.2,54.2 57,50.5 57,45.8 L57,45.8 L57,4.1 L44.7,4.1 L44.7,4.2 Z" fill="url(#icon-cc-jcb-lg-5)"></path>
        </g>
    </g>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconCcJcbModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('cc-jcb', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
