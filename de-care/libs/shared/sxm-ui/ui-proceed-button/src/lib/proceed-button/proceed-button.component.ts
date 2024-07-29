import { Component, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'button[sxm-proceed-button]',
    templateUrl: './proceed-button.component.html',
    styleUrls: ['./proceed-button.component.scss']
})
export class SxmProceedButtonComponent {
    public isLoading = false;

    @HostBinding('class.loading')
    hasClassLoading: boolean = false;

    @HostBinding('class.primary')
    hasClassPrimary: boolean = true;

    @HostBinding('class.secondary')
    hasClassSecondary: boolean = false;

    @HostBinding('class.button')
    hasClassButton: boolean = true;

    @HostBinding('class.full-width')
    hasClassFullWidth: boolean = true;

    @HostBinding('disabled')
    isDisabled: boolean;

    @Input() set loading(isLoading: boolean) {
        this.isLoading = isLoading;
        this.hasClassLoading = isLoading;
        this.isDisabled = isLoading;
    }
    @Input() set fullWidth(isFull: boolean) {
        this.hasClassFullWidth = isFull;
    }
    @Input() set secondary(isSecondary: boolean) {
        this.hasClassPrimary = !isSecondary;
        this.hasClassSecondary = isSecondary;
    }
}
