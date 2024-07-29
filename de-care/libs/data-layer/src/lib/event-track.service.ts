import { Injectable } from '@angular/core';
import { DataTrackerService } from '@de-care/shared/data-tracker';

@Injectable({
    providedIn: 'root'
})
export class SharedEventTrackService {
    constructor(private _dataTrackerService: DataTrackerService) {}

    public track(action: string, data: any): void {
        this._dataTrackerService.trackEvent(action, data);
    }
}
