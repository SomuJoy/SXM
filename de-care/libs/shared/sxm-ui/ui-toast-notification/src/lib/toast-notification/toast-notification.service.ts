import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastNotificationService {
    private _notification$ = new Subject<string>();

    getNotification() {
        return this._notification$;
    }

    showNotification(copy: string) {
        this._notification$.next(copy);
    }
}
