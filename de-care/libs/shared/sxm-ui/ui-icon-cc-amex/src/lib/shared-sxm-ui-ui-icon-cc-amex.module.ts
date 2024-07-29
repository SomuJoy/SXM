import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 58">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill-rule="nonzero">
            <rect fill="#0B7DC0" x="0" y="0" width="93" height="58"></rect>
            <path d="M0,27.3 L4.4,27.3 L5.4,24.9 L7.7,24.9 L8.7,27.3 L17.5,27.3 L17.5,25.4 L18.3,27.3 L22.9,27.3 L23.7,25.4 L23.7,27.3 L45.6,27.3 L45.6,23.3 L46,23.3 C46.3,23.3 46.4,23.3 46.4,23.8 L46.4,27.3 L57.7,27.3 L57.7,26.4 C59,27 60.4,27.4 61.9,27.3 L66.7,27.3 L67.7,24.9 L70,24.9 L71,27.3 L80.2,27.3 L80.2,24.9 L81.6,27.2 L89,27.2 L89,12 L81.7,12 L81.7,13.8 L80.7,12 L73.2,12 L73.2,13.8 L72.1,12 L62.1,12 C60.6,11.9 59.1,12.2 57.7,12.9 L57.7,12 L50.7,12 L50.7,12.9 C49.8,12.2 48.8,11.9 47.7,12 L22.4,12 L20.7,16 L19,12 L11,12 L11,13.8 L10,12.1 L3.2,12.1 L0,19.3 L0,27.3 Z M86.5,25.1 L82.8,25.1 L77.8,16.9 L77.8,25.1 L72.5,25.1 L71.5,22.7 L66,22.7 L65,25.1 L62,25.1 C59.5,25.4 57.1,23.7 56.8,21.1 C56.7,20.6 56.7,20.1 56.8,19.7 C56.7,18.1 57.2,16.6 58.2,15.4 C59.3,14.4 60.7,14 62.2,14.1 L64.7,14.1 L64.7,16.4 L62.2,16.4 C61.5,16.3 60.7,16.6 60.2,17.1 C59.7,17.8 59.4,18.7 59.5,19.6 C59.4,20.5 59.7,21.4 60.2,22.2 C60.7,22.6 61.4,22.8 62,22.8 L63.2,22.8 L66.9,14.2 L70.8,14.2 L75.2,24.6 L75.2,14.2 L79.2,14.2 L83.8,21.8 L83.8,14.2 L86.5,14.2 L86.5,25.1 Z M55.5,25.1 L52.8,25.1 L52.8,14.1 L55.5,14.1 L55.5,25.1 Z M51.4,17.1 C51.4,18.4 50.7,19.5 49.5,20 C50,20.2 50.5,20.5 50.8,20.9 C51.2,21.5 51.3,22.2 51.2,22.9 L51.2,25.1 L48.6,25.1 L48.6,23.7 C48.7,23 48.6,22.2 48.2,21.6 C47.8,21.2 47.2,21.1 46.3,21.1 L43.5,21.1 L43.5,25.1 L40.9,25.1 L40.9,14.1 L46.9,14.1 C48,14 49.1,14.2 50.1,14.6 C50.9,15.2 51.4,16.1 51.4,17.1 L51.4,17.1 Z M39,25.1 L30.2,25.1 L30.2,14.1 L39,14.1 L39,16.4 L32.9,16.4 L32.9,18.4 L38.9,18.4 L38.9,20.6 L32.9,20.6 L32.9,22.8 L39,22.8 L39,25.1 Z M28.3,25.1 L25.6,25.1 L25.6,16.5 L21.8,25.1 L19.5,25.1 L15.7,16.5 L15.7,25.1 L10.4,25.1 L9.4,22.7 L3.9,22.7 L2.9,25.1 L0.1,25.1 L4.8,14.1 L8.7,14.1 L13.2,24.5 L13.2,14.2 L17.5,14.2 L20.9,21.6 L24,14.2 L28.4,14.2 L28.3,25.1 Z M70.6,20.4 L68.8,16 L67,20.4 L70.6,20.4 Z M47.9,18.7 C47.5,18.9 47,19 46.6,18.9 L43.4,18.9 L43.4,16.5 L46.6,16.5 C47,16.5 47.5,16.5 47.8,16.7 C48.2,16.9 48.4,17.3 48.3,17.7 C48.5,18.1 48.3,18.5 47.9,18.7 L47.9,18.7 Z M8.4,20.4 L6.6,16 L4.8,20.4 L8.4,20.4 Z" fill="#FFFFFF"></path>
            <path d="M50.8,36.7 C50.8,39.7 48.5,40.4 46.2,40.4 L43,40.4 L43,44 L37.9,44 L34.7,40.4 L31.3,44 L20.9,44 L20.9,33 L31.4,33 L34.6,36.6 L38,33 L46.4,33 C48.4,33.1 50.8,33.6 50.8,36.7 Z M30,41.7 L23.6,41.7 L23.6,39.5 L29.4,39.5 L29.4,37.3 L23.6,37.3 L23.6,35.3 L30.2,35.3 L33.1,38.5 L30,41.7 Z M40.3,43 L36.3,38.5 L40.3,34.2 L40.3,43 Z M46.3,38.1 L43,38.1 L43,35.3 L46.4,35.3 C47.4,35.3 48,35.7 48,36.6 C48,37.5 47.4,38.1 46.3,38.1 L46.3,38.1 Z M64,33.1 L72.8,33.1 L72.8,35.4 L66.7,35.4 L66.7,37.4 L72.7,37.4 L72.7,39.6 L66.7,39.6 L66.7,41.8 L72.8,41.8 L72.8,44 L64,44 L64,33.1 Z M60.7,38.9 C61.2,39.1 61.7,39.4 62,39.8 C62.4,40.4 62.5,41.1 62.4,41.8 L62.4,44 L59.8,44 L59.8,42.6 C59.9,41.9 59.8,41.1 59.4,40.5 C59,40.1 58.4,40 57.5,40 L54.7,40 L54.7,44 L52,44 L52,33 L58,33 C59.1,32.9 60.2,33.1 61.2,33.5 C62.1,34 62.6,34.9 62.5,35.9 C62.6,37.2 61.9,38.4 60.7,38.9 Z M59.1,37.6 C58.7,37.8 58.3,37.9 57.8,37.8 L54.6,37.8 L54.6,35.3 L57.8,35.3 C58.2,35.3 58.7,35.3 59,35.5 C59.4,35.7 59.6,36.1 59.5,36.5 C59.7,36.9 59.5,37.3 59.1,37.6 L59.1,37.6 Z M82.8,38.2 C83.4,38.8 83.7,39.7 83.6,40.5 C83.6,42.9 82.1,44 79.5,44 L74.4,44 L74.4,41.6 L79.5,41.6 C79.9,41.6 80.3,41.5 80.6,41.3 C80.8,41.1 80.9,40.9 80.9,40.6 C80.9,40.3 80.8,40 80.5,39.8 C80.2,39.6 79.9,39.5 79.6,39.6 C77.1,39.5 74.1,39.7 74.1,36.2 C74.1,34.6 75.1,32.9 77.9,32.9 L83,32.9 L83,35.2 L78.2,35.2 C77.8,35.2 77.5,35.2 77.1,35.4 C76.8,35.6 76.7,35.9 76.7,36.2 C76.7,36.6 76.9,36.9 77.3,37 C77.6,37.1 78,37.1 78.3,37.1 L79.7,37.1 C80.8,37.2 81.9,37.5 82.8,38.2 L82.8,38.2 Z M93.2,42.6 C92.6,43.5 91.3,44 89.6,44 L84.5,44 L84.5,41.6 L89.5,41.6 C89.9,41.6 90.3,41.6 90.6,41.3 C91,40.9 91,40.3 90.6,39.9 C90.6,39.9 90.6,39.9 90.6,39.9 C90.3,39.7 90,39.6 89.7,39.7 C87.2,39.6 84.2,39.8 84.2,36.3 C84.2,34.7 85.2,33 88,33 L93.2,33 L93.2,30.8 L88.3,30.8 C87.1,30.7 86,31.1 85,31.7 L85,30.8 L77.8,30.8 C76.7,30.7 75.6,31.1 74.7,31.7 L74.7,30.8 L62,30.8 L62,31.7 C60.9,31.1 59.7,30.8 58.5,30.8 L50,30.8 L50,31.7 C49.2,30.9 47.4,30.8 46.3,30.8 L36.8,30.8 L34.6,33.1 L32.6,30.8 L18.5,30.8 L18.5,46.1 L32.4,46.1 L34.6,43.7 L36.7,46.1 L45.2,46.1 L45.2,42.5 L46.1,42.5 C47.3,42.6 48.6,42.4 49.7,42 L49.7,46.1 L56.7,46.1 L56.7,42.1 L57,42.1 C57.4,42.1 57.5,42.1 57.5,42.5 L57.5,46 L79,46 C80.3,46 81.5,45.7 82.6,45 L82.6,46 L89.4,46 C90.7,46 92,45.8 93.2,45.3 L93.2,42.6 Z M93.2,35.4 L88.4,35.4 C88,35.4 87.7,35.4 87.4,35.6 C87.1,35.8 87,36.1 87,36.4 C87,36.8 87.2,37.1 87.6,37.2 C87.9,37.3 88.3,37.3 88.6,37.3 L90,37.3 C91.1,37.2 92.2,37.5 93,38.2 C93.1,38.3 93.2,38.4 93.2,38.5 L93.2,35.4 Z" fill="#FFFFFF"></path>
        </g>
    </g>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconCcAmexModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('cc-amex', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}
