import { Inject, Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

// TODO: Move this to a lib home
@Injectable({ providedIn: 'root' })
export class BrowserBackInterceptorService {
    private readonly _entryHistoryState;
    private _forwardCount = 0;
    private readonly _history: History;
    onBrowserBack$ = fromEvent(this._document.defaultView, 'popstate').pipe(
        map<Event, 'BACK' | 'FORWARD' | 'BEGINNING'>(() => {
            if (this._forwardCount === 0) {
                return 'BEGINNING';
            }
            const poppedCount = this._history.state?.uid || 0;
            return poppedCount < this._forwardCount ? 'BACK' : 'FORWARD';
        }),
        tap((direction) => {
            switch (direction) {
                case 'BEGINNING': {
                    this._history.back();
                    break;
                }
                case 'BACK': {
                    this._forwardCount = this._forwardCount - 1;
                    if (this._forwardCount > 0) {
                        this._history.pushState({ uid: this._forwardCount }, null, null);
                    } else {
                        this._history.pushState(this._entryHistoryState, null, null);
                    }
                    break;
                }
                case 'FORWARD': {
                    break;
                }
            }
        }),
        filter((d) => d === 'BACK' || d === 'BEGINNING')
    );

    constructor(@Inject(DOCUMENT) private _document: Document) {
        this._history = this._document.defaultView.history;
        this._entryHistoryState = { ...this._document.defaultView.history.state };
    }

    captureNav() {
        if (this._forwardCount === 0) {
            this._forwardCount = 1;
            this._history.pushState({ uid: this._forwardCount }, null, null);
        } else {
            this._forwardCount = this._forwardCount + 1;
            this._history.replaceState({ uid: this._forwardCount }, null, null);
        }
    }

    silentBack() {
        this._forwardCount = this._forwardCount - 1;
        if (this._forwardCount > 0) {
            this._history.replaceState({ uid: this._forwardCount }, null, null);
        } else {
            this._history.replaceState(this._entryHistoryState, null, null);
        }
    }
}
