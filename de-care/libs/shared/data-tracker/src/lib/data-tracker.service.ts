import { Injectable, NgZone } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { Observable, Subject, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Angulartics2LaunchByAdobe } from 'angulartics2/launch';

@Injectable({ providedIn: 'root' })
export class DataTrackerService {
    private _errors$: Subject<any>;
    errors$: Observable<any>;

    constructor(private _angulartics2: Angulartics2, private _angulartics2LaunchByAdobe: Angulartics2LaunchByAdobe, private _ngZone: NgZone) {
        this._errors$ = new Subject();
        this.errors$ = this._errors$.asObservable();
    }

    startTracking(): void {
        this._insulate(() => {
            this._angulartics2LaunchByAdobe.startTracking();
        });
    }

    trackEvent(action: string, properties: any): void {
        this._insulate(() => {
            this._angulartics2.eventTrack.next({ action, properties });
        });
    }

    trackPage(path: any): void {
        this._insulate(() => {
            this._angulartics2.pageTrack.next({ path });
        });
    }

    private _insulate(fn: () => void): void {
        this._ngZone.runOutsideAngular(() => {
            timer(1)
                .pipe(
                    tap(() => {
                        fn();
                    })
                )
                .subscribe({
                    error: error => {
                        this._errors$.next(error);
                    }
                });
        });
    }
}
