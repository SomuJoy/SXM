import { Component, OnInit, ApplicationRef, Input, OnDestroy } from '@angular/core';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import { Subscription } from 'rxjs';

@Component({
    selector: 'sxm-ui-show-hide',
    templateUrl: './show-hide.component.html',
    styleUrls: ['./show-hide.component.scss']
})
export class SxmUiShowHideComponent implements OnInit, OnDestroy {
    constructor(private _printService: PrintService, private _appRef: ApplicationRef) {}

    @Input() set expandOnPrint(value: boolean) {
        if (value === true) {
            this._unsubscribePrintServices();
            this._printRequestedSubscription = this._printService.printRequested$.subscribe(_ => {
                this.animationDisabled = true;
                this.opened = true;
                this.updateDisplayState();
                this._appRef.tick();
            });
            this._afterPrintSubscription = this._printService.afterPrint$.subscribe(_ => {
                this.opened = false;
                this.updateDisplayState();
                this.animationDisabled = false;
                this._appRef.tick();
            });
        }
    }
    @Input() collapsedText: string;
    @Input() expandedText: string;
    @Input() opened: boolean = false;
    ariaHidden: boolean = false;
    animationDisabled = false;
    private _printRequestedSubscription: Subscription;
    private _afterPrintSubscription: Subscription;

    ngOnInit() {
        this.updateDisplayState();
    }

    ngOnDestroy(): void {
        this._unsubscribePrintServices();
    }

    handleClick(): void {
        this.opened = !this.opened;
        this.updateDisplayState();
    }

    private updateDisplayState(): void {
        this.ariaHidden = !this.opened;
    }

    private _unsubscribePrintServices(): void {
        if (this._printRequestedSubscription) {
            this._printRequestedSubscription.unsubscribe();
        }
        if (this._afterPrintSubscription) {
            this._afterPrintSubscription.unsubscribe();
        }
    }
}
