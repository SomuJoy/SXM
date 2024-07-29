import { ElementRef, Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SharedDocumentEventService {
    private observable: Observable<Event>;

    constructor() {
        this.observable = fromEvent(window, 'click');
    }

    public clickAway(el: ElementRef): Observable<Event> {
        return this.observable.pipe(filter((event: Event): boolean => !event.composedPath().includes(el.nativeElement)));
    }
}
