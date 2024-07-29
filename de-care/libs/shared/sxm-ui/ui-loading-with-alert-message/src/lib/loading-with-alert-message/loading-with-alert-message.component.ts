import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
@Component({
    selector: 'sxm-ui-loading-with-alert-message',
    templateUrl: './loading-with-alert-message.component.html',
    styleUrls: ['./loading-with-alert-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SxmUiLoadingWithAlertMessageComponent implements AfterViewInit {
    @Input() isLoading = false;
    @Input() pillMessage: string;
    @Input() paragraph: string;
    @Output() loadingCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngAfterViewInit() {
        this.loadingCompleted.emit(true);
    }
}
