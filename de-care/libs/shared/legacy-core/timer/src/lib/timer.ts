import { interval, Subject, Subscription } from 'rxjs';
import { tap, takeWhile, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class Timer {
    private static instance: Timer;

    readonly inactiveTimeLimitReached$ = new Subject<boolean>();
    readonly secondsIdle$ = new Subject<number>();
    private _subscription: Subscription;
    private _timerRunning = false;
    private _startTimer$ = new Subject<null>();
    private _secondsIdleSubscription: Subscription;
    private _inactiveTimeLimitReachedSubscription: Subscription;

    constructor() {
        // Note: this makes the class a singleton.
        if (!Timer.instance) {
            Timer.instance = this;
        }
        return Timer.instance;
    }

    start(allowedIdleTimeInSeconds: number, { onTimeLimitReached, onSecondsTick }: { onTimeLimitReached?: () => void; onSecondsTick?: (second: number) => void }): void {
        if (this._timerRunning) {
            return;
        }

        const timer$ = interval(1000).pipe(tap(seconds => this.secondsIdle$.next(++seconds)));

        this._subscription = this._startTimer$
            .pipe(
                tap(_ => {
                    this._timerRunning = true;
                }),
                switchMap(() => timer$),
                takeWhile(seconds => seconds < allowedIdleTimeInSeconds - 1)
            )
            .subscribe({
                complete: () => {
                    this.inactiveTimeLimitReached$.next(true);
                    this._cleanUp();
                }
            });

        if (onTimeLimitReached) {
            this._inactiveTimeLimitReachedSubscription = this.inactiveTimeLimitReached$.subscribe(onTimeLimitReached);
        }
        if (onSecondsTick) {
            this._secondsIdleSubscription = this.secondsIdle$.subscribe(onSecondsTick);
        }

        this._startTimer$.next();
    }

    stop(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this._cleanUp();
    }

    reset(): void {
        if (this._timerRunning) {
            this._startTimer$.next();
        }
    }

    private _cleanUp(): void {
        this._timerRunning = false;
        if (this._inactiveTimeLimitReachedSubscription) {
            this._inactiveTimeLimitReachedSubscription.unsubscribe();
        }
        if (this._secondsIdleSubscription) {
            this._secondsIdleSubscription.unsubscribe();
        }
    }
}
