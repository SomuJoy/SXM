import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import {
    getIsModeServicePortability,
    IdentificationWorkflowService,
    IndentificationWorkflowServiceResponseEnum,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { select, Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class AddRadioPageCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _identificationWorkflowService: IdentificationWorkflowService, private readonly _store: Store) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._store.pipe(
            select(getIsModeServicePortability),
            concatMap((isModeSP) => {
                // if the mode is already set as SP that means we are returning to the screen after having gone to the the SP flow, so don't call identification workflow again
                return isModeSP
                    ? of(true)
                    : this._identificationWorkflowService.build().pipe(
                          map((response) => {
                              switch (response) {
                                  //Check against the enum response to dynamically decide the page to route to
                                  case IndentificationWorkflowServiceResponseEnum.SUCCESS:
                                      return true;
                                  case IndentificationWorkflowServiceResponseEnum.TRIAL_ALREADY_CONSOLIDATED_AND_HAS_FOLLOWON:
                                      return this._router.createUrlTree(['transfer/radio/consolidated']);
                                  case IndentificationWorkflowServiceResponseEnum.TRIAL_ALREADY_CONSOLIDATED_AND_NO_FOLLOWON:
                                      return this._router.createUrlTree(['transfer/radio/consolidated-offer']);
                                  case IndentificationWorkflowServiceResponseEnum.NO_TRIAL_RADIO_ID:
                                      return this._router.createUrlTree(['transfer/radio/lookup']);
                                  default:
                                      return this._router.createUrlTree(['transfer/radio/error']);
                              }
                          })
                      );
            })
        );
    }
}
