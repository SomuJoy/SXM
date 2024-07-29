import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, HostBinding, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'sxm-ui-loading-overlay',
    templateUrl: './loading-overlay.component.html',
    styleUrls: ['./loading-overlay.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SxmLoadingOverlayComponent {
    @HostBinding('class.loading') get loading() {
        return this.isLoading;
    }

    @Input() isLoading = false;
}
