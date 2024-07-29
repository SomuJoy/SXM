import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators';
import { AppTimer, Timer } from '@de-care/shared/legacy-core/timer';

@Injectable({
    providedIn: 'root'
})
export class BrowserSessionTrackerService {
    readonly apiLastCallTimerLimitReached$: Observable<boolean>;
    readonly apiPingNeeded$: Observable<boolean>;
    private _timeLimitInSeconds = 60 * 20; // 20 minutes
    private _timeThresholdForApiPingInSeconds = 400;
    private _apiLastCalledTimerStarted = false;

    constructor(@Inject(AppTimer) private _timer: Timer) {
        this.apiLastCallTimerLimitReached$ = this._timer.inactiveTimeLimitReached$.pipe(takeWhile(limitReached => !limitReached, true));
        this.apiPingNeeded$ = this._timer.secondsIdle$.pipe(map(secondsSinceLastApiCall => secondsSinceLastApiCall > this._timeThresholdForApiPingInSeconds));
        // TODO: Consider wiring up to browser unload event and handle completing all subscriptions
    }

    startApiLastCalledTimer(onSecondsTick?: (second: number) => void): void {
        // Note: only allows the timer to be started once
        if (this._apiLastCalledTimerStarted) {
            return;
        }
        this._apiLastCalledTimerStarted = true;
        this._timer.start(this._timeLimitInSeconds, { onSecondsTick });
    }

    stopApiLastCalledTimer(): void {
        this._timer.stop();
    }

    resetApiLastCalledTimer(): void {
        if (this._apiLastCalledTimerStarted) {
            this._timer.reset();
        }
    }
}
