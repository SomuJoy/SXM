import { ChangeDetectionStrategy, Component, Input, HostBinding } from '@angular/core';

@Component({
    selector: '[sxm-loading-indicator]',
    templateUrl: './loading-indicator.component.html',
    styleUrls: ['./loading-indicator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SxmLoadingIndicatorComponent {
    @HostBinding('class.loading') get loading() {
        return this.isLoading;
    }

    // tslint:disable-next-line: no-input-rename
    @Input('sxm-loading-indicator') isLoading = false;
}
