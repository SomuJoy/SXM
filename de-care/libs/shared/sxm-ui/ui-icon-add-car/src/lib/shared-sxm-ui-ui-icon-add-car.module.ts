import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

const ICON = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="64px" height="64px" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Assets / Icons / Content / Add Car</title>
    <g stroke-width="1" fill-rule="evenodd">
        <g transform="translate(6.000000, 11.000000)">
            <path d="M49,41 C49,41.552 48.551,42 48,42 L42,42 C41.449,42 41,41.552 41,41 L41,38.992 C42.607,38.936 44.173,38.585 45.658,37.948 L47.97,36.958 C48.342,36.799 48.686,36.599 49,36.363 L49,41 Z M11,41 C11,41.552 10.551,42 10,42 L4,42 C3.449,42 3,41.552 3,41 L3,36.363 C3.314,36.599 3.659,36.799 4.031,36.958 L6.342,37.948 C7.827,38.585 9.393,38.936 11,38.992 L11,41 Z M3,25.721 L3.926,25.412 C4.6,25.188 5.332,25.21 5.988,25.473 L12.729,28.169 C13.621,28.525 14.293,29.295 14.525,30.227 L14.719,31 L12.176,31 C10.854,31 9.553,30.765 8.313,30.3 L3,28.307 L3,25.721 Z M2,15.323 L2,14 C2,12.897 2.896,12 4,12 L8.082,12 L7.117,14.512 L5.467,16.71 L2,15.323 Z M43.021,36.706 C42.209,36.895 41.381,37 40.537,37 L11.463,37 C9.965,37 8.507,36.7 7.129,36.11 L4.818,35.12 C3.714,34.646 3,33.563 3,32.362 L3,30.443 L7.611,32.173 C9.076,32.722 10.612,33 12.176,33 L29.441,33 C28.746,32.388 28.101,31.723 27.521,31 L16.781,31 L16.467,29.742 C16.078,28.189 14.959,26.907 13.473,26.312 L6.732,23.615 C5.637,23.178 4.414,23.141 3.293,23.515 L3.098,23.58 C3.195,23.203 3.365,22.846 3.6,22.533 L8.5,16 L24.808,16 C25.035,15.31 25.314,14.646 25.629,14 L9.456,14 L13.738,2.867 C15.051,2.617 19.004,2 26,2 C32.996,2 36.949,2.617 38.262,2.867 L39.1,5.045 C39.399,5.028 39.696,5 40,5 C40.422,5 40.836,5.031 41.249,5.063 L39.746,1.156 L39.242,1.03 C39.074,0.988 35.02,0 26,0 C16.98,0 12.926,0.988 12.758,1.03 L12.254,1.156 L8.852,10 L4,10 C1.795,10 0,11.794 0,14 L0,15.323 C0,16.146 0.494,16.875 1.257,17.18 L4.225,18.367 L2,21.334 C1.355,22.193 1,23.259 1,24.333 L1,41 C1,42.654 2.346,44 4,44 L10,44 C11.654,44 13,42.654 13,41 L13,39 L39,39 L39,41 C39,42.654 40.346,44 42,44 L48,44 C49.654,44 51,42.654 51,41 L51,32.599 C48.826,34.661 46.082,36.121 43.021,36.706 L43.021,36.706 Z"></path>
            <path d="M40,32 C33.935,32 29,27.065 29,21 C29,14.935 33.935,10 40,10 C46.065,10 51,14.935 51,21 C51,27.065 46.065,32 40,32 M40,8 C32.832,8 27,13.832 27,21 C27,28.168 32.832,34 40,34 C47.168,34 53,28.168 53,21 C53,13.832 47.168,8 40,8"></path>
            <polygon points="41 14 39 14 39 20 33 20 33 22 39 22 39 28 41 28 41 22 47 22 47 20 41 20"></polygon>
        </g>
    </g>
</svg>
`;

@NgModule({
    exports: [MatIconModule],
    imports: [MatIconModule],
})
export class SharedSxmUiUiIconAddCarModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIconLiteral('add-car', sanitizer.bypassSecurityTrustHtml(ICON));
    }
}