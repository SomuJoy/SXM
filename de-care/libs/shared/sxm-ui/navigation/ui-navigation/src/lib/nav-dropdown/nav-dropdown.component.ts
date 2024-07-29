import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgModule, Output, ViewEncapsulation } from '@angular/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';

@Component({
    selector: 'sxm-ui-nav-dropdown',
    templateUrl: './nav-dropdown.component.html',
    styleUrls: ['./nav-dropdown.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class SxmUiNavDropdownComponent {
    @Input() set open(isOpen: boolean) {
        this._open = isOpen;
        this._changeDetectorRef.detectChanges();
    }
    get open(): boolean {
        return this._open;
    }
    @Input() align: 'left' | 'right' = 'left';
    @Input() arrowColor = 'black';
    @Input() buttonAriaLabel: string;
    @Input() buttonLinkKey: string;
    @Input() buttonLinkName: string;

    @Output() isOpened = new EventEmitter();
    _open = false;
    constructor(private _changeDetectorRef: ChangeDetectorRef) {}
    onToggle() {
        this.open = !this.open;
        if (this.open) {
            this.isOpened.emit();
        }
    }
}

@NgModule({
    imports: [CommonModule, SharedSxmUiUiDataClickTrackModule],
    declarations: [SxmUiNavDropdownComponent],
    exports: [SxmUiNavDropdownComponent],
})
export class SxmUiNavDropdownModule {}
