import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PrintService {
    printRequested$ = new Subject();
    afterPrint$ = new Subject();
    private readonly _windowPrintFunction = () => {};

    constructor(@Inject(DOCUMENT) document: Document) {
        const window = document && document.defaultView;
        if (window.print) {
            this._windowPrintFunction = window.print.bind(window);
        }
    }

    print(): void {
        this.printRequested$.next();
        this._windowPrintFunction();
        this.afterPrint$.next();
    }
}
