import { Component, OnInit, Input, ViewEncapsulation, OnDestroy, ApplicationRef, Output, EventEmitter, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
// TODO: elevate this (or maybe move into sxm-ui if only used here)
import { HideHeightAnimation, HideHeightAnimationCollapseState } from '@de-care/shared/animations';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import * as uuid from 'uuid/v4';
export interface AccordionChevronInfo {
    clickCount: number;
    opened: boolean;
}
@Component({
    selector: 'sxm-ui-accordion-chevron',
    templateUrl: './accordion-chevron.component.html',
    styleUrls: ['./accordion-chevron.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [HideHeightAnimation],
})
export class SxmUiAccordionChevronComponent implements OnInit, OnDestroy {
    accordionContentWrapperId: string;
    constructor(private _printService: PrintService, private _appRef: ApplicationRef) {
        this.accordionContentWrapperId = `accordionContentWrapper_${uuid()}`;
    }
    @Input() set expandOnPrint(value: boolean) {
        if (value === true) {
            this._unsubscribePrintServices();
            this._printRequestedSubscription = this._printService.printRequested$.subscribe((_) => {
                this.animationDisabled = true;
                this._isOpenedBeforePrint = this.opened;
                this.opened = true;
                this.updateDisplayState();
                this._appRef.tick();
            });
            this._afterPrintSubscription = this._printService.afterPrint$.subscribe((_) => {
                this.opened = this._isOpenedBeforePrint;
                this.updateDisplayState();
                this.animationDisabled = false;
                this._appRef.tick();
            });
        }
    }

    @Input() collapsedText: string;
    @Input() expandedText: string;
    @Input() opened: boolean = false;
    @Input() aria: { collapsedText?: string; expandedText?: string } | null;
    @Input() isInnerAccordion: boolean = false;
    @Input() showInnerAccordion: boolean = true;
    @Output() chevronClick = new EventEmitter<AccordionChevronInfo>();

    clickCount: number = 0;
    openedFull: boolean = false;
    collapseState: HideHeightAnimationCollapseState = HideHeightAnimationCollapseState.CLOSED;
    hideContent = false;
    animationDisabled = false;
    private _printRequestedSubscription: Subscription;
    private _afterPrintSubscription: Subscription;
    private _isOpenedBeforePrint = false;
    ngOnInit() {
        this.updateDisplayState();
    }

    ngOnDestroy(): void {
        this._unsubscribePrintServices();
    }

    handleClick(): void {
        this.opened = !this.opened;
        this.updateDisplayState();
        this.clickCount++;
        this.chevronClick.emit(this._buildAccordionChevronInfo());
    }

    private updateDisplayState(): void {
        this.openedFull = false;
        if (this.opened) {
            this.hideContent = false;
            this.collapseState = HideHeightAnimationCollapseState.OPENED;
        } else {
            this.collapseState = HideHeightAnimationCollapseState.CLOSED;
        }
    }

    doneCallback() {
        this.hideContent = !this.opened;
        if (this.opened) {
            this.openedFull = true;
        }
    }

    private _unsubscribePrintServices(): void {
        if (this._printRequestedSubscription) {
            this._printRequestedSubscription.unsubscribe();
        }
        if (this._afterPrintSubscription) {
            this._afterPrintSubscription.unsubscribe();
        }
    }

    private _buildAccordionChevronInfo(): AccordionChevronInfo {
        return {
            clickCount: this.clickCount,
            opened: this.opened,
        };
    }
}
