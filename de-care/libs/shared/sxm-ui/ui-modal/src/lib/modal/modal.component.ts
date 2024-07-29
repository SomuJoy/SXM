import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter, Inject, ElementRef, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as uuid from 'uuid/v4';
import { timer } from 'rxjs';

@Component({
    selector: 'sxm-ui-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    exportAs: 'sxmUiModal',
})
export class SxmUiModalComponent implements OnInit {
    private _closed = true;

    @Output() modalClosed = new EventEmitter();
    @Output() backButton = new EventEmitter();
    @Input() titlePresent = false;
    @Input() title: string;
    @Input() ariaDescribedbyTextId: string;
    @Input() showBackButton = false;
    @Input() showCloseButton = true;
    @ViewChild('modalContentRef') private readonly _modalContentRef: ElementRef;

    alertHeadingId = uuid();

    @Input()
    set closed(value: boolean) {
        this._closed = value;
    }

    get closed() {
        return this._closed;
    }

    constructor(private _changeDetectorRef: ChangeDetectorRef, @Inject(DOCUMENT) private readonly _document: Document) {}

    ngOnInit() {}

    /*
     * Use this function only in parent component with viewChild
     */
    open(): void {
        this.closed = false;
        // forces component changes detection, viewChild doest execute it automatically
        this._changeDetectorRef.markForCheck();
        if (this._document) {
            document.body.classList.add('modal-open');
        }
        if (this._modalContentRef) {
            timer(1).subscribe(() => this._modalContentRef.nativeElement.focus());
        }
    }
    /*
     * Use this function only in parent component with viewChild
     */
    close(): void {
        this.closed = true;
        // forces component changes detection, viewChild doest execute it automatically
        this._changeDetectorRef.markForCheck();
        if (this._document) {
            document.body.classList.remove('modal-open');
        }
    }

    /*
     * use Only this function inside the component
     */
    innerClose(): void {
        this.closed = true;
        this.modalClosed.emit();
        if (this._document) {
            document.body.classList.remove('modal-open');
        }
    }

    fireBackButton(): void {
        this.backButton.emit();
    }
    handleCloseEvent() {
        if (this.showBackButton) {
            this.fireBackButton();
        } else if (this.showCloseButton) {
            this.innerClose();
        }
    }
}
