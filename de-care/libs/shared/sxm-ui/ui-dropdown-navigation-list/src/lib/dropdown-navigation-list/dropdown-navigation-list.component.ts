import { ChangeDetectorRef, Component, ElementRef, Inject, Input, NgModule, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedDocumentEventService } from '@de-care/browser-common';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface ListItem {
    label: string;
    link: string;
    target: string;
}

@Component({
    selector: 'sxm-ui-dropdown-navigation-list',
    templateUrl: './dropdown-navigation-list.component.html',
    styleUrls: ['./dropdown-navigation-list.component.scss'],
})
export class SxmUiDropdownNavigationListComponent {
    @Input() buttonLabel: { label: string; ariaLabel?: string };
    @Input() listData: ListItem[];
    opened = false;

    @ViewChild('dropdown', { static: true }) dropdown: ElementRef;
    modifyClickSubscription: Subscription;
    private unsubscribe$ = new Subject<void>();
    private readonly _window: Window;

    constructor(
        private readonly docEvents: SharedDocumentEventService,
        private readonly _changeDetectionRef: ChangeDetectorRef,
        @Inject(DOCUMENT) readonly document: Document
    ) {
        this._window = document?.defaultView;
    }

    onClick(): void {
        if (this.opened) {
            this.closeDropdownMenu();
        } else {
            this._openDropdownMenu();
        }
    }

    private _openDropdownMenu(): void {
        this.opened = true;
        if (this.modifyClickSubscription === undefined || this.modifyClickSubscription.closed) {
            this.modifyClickSubscription = this.docEvents
                .clickAway(this.dropdown)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(() => this.closeDropdownMenu());
        }
        this._changeDetectionRef.markForCheck();
    }

    closeDropdownMenu(): void {
        this.opened = false;
        this.unsubscribe$.next();
        this._changeDetectionRef.markForCheck();
    }
}

@NgModule({
    declarations: [SxmUiDropdownNavigationListComponent],
    exports: [SxmUiDropdownNavigationListComponent],
    imports: [CommonModule, RouterModule],
})
export class SharedSxmUiDropdownNavigationListModule {}
