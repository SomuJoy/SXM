import { Inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoadCardBinRangesWorkflowService } from '@de-care/domains/utility/state-card-bin-ranges';
import { BinRangesToken, CardBinRanges } from '@de-care/shared/validation';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadCardBinRangesAsyncCanActivateService implements CanActivate {
    constructor(private readonly _loadCardBinRangesWorkflowService: LoadCardBinRangesWorkflowService, @Inject(BinRangesToken) private _binRanges: CardBinRanges) {}

    canActivate(): Observable<boolean> {
        this._loadCardBinRangesWorkflowService.build().subscribe((binRanges) => {
            this._binRanges.binRanges = binRanges;
        });
        return of(true);
    }
}
