import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'de-care-logo-link',
    templateUrl: './logo-link.component.html',
    styleUrls: ['./logo-link.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoLinkComponent {
    @Input() imageSrc: string;
    @Input() link: string;
    @Input() altText = '';

    constructor() {}
}
