import { Injectable } from '@angular/core';
import { Account, LoadAccountDirectResponseWorkflowService, LoadAccountNonPiiDirectResponseWorkflowService } from '@de-care/domains/account/state-account';
import { NextBestActionWorkflowService } from '@de-care/domains/account/state-next-best-actions';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { AccountPresenceStore } from './account-presence-store.component';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';

@Injectable()
export class AccountPresenceService {
    constructor(
        private readonly _accountPresenceStore: AccountPresenceStore,
        private readonly _loadAccountDirectResponseWorkflowService: LoadAccountDirectResponseWorkflowService,
        private readonly _loadAccountNonPiiDirectResponseWorkflowService: LoadAccountNonPiiDirectResponseWorkflowService,
        private readonly _nextBestActionWorkflowService: NextBestActionWorkflowService,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService
    ) {}

    loadAccount(): Observable<Account> {
        return this._loadAccountDirectResponseWorkflowService.build({}).pipe(
            tap((account) => {
                this._accountPresenceStore.setFirstName(this._formatName(account?.firstName));
                this._accountPresenceStore.setNextBillingPaymentDate(account?.billingSummary?.nextPaymentDate);
                this._accountPresenceStore.setAccountBillingSummaryAmountDue(account?.billingSummary?.amountDue);
            }),
            catchError((err) => {
                return throwError(err);
            })
        );
    }

    loadNonPiiAccount(): Observable<Account> {
        return this._loadAccountNonPiiDirectResponseWorkflowService.build({ identifiedUser: true }).pipe(
            tap((account) => {
                this._accountPresenceStore.setFirstName(this._formatName(account?.firstName));
            }),
            catchError((err) => {
                return throwError(err);
            })
        );
    }

    loadNba(): Observable<boolean> {
        return this._nextBestActionWorkflowService.build().pipe(
            map((nbaResponse) => {
                this._accountPresenceStore.setIdentificationState(nbaResponse.identificationState);
                if (nbaResponse.identificationState === 'IDENTIFIED' || nbaResponse.identificationState === 'LOGGEDIN') {
                    this._accountPresenceStore.setNbaActions(nbaResponse?.actions);
                    // Temporary filter to only add PAYMENT, SC_AC & PAYMENT_REMINDER type
                    const filteredActions = nbaResponse?.actions?.filter(
                        (action) =>
                            action.type === 'PAYMENT' ||
                            action.type === 'SC_AC' ||
                            action.type === 'PAYMENT_REMINDER' ||
                            action.type === 'CONVERT' ||
                            action.type === 'UPGRADE' ||
                            action.type === 'DEVICES' ||
                            action.type === 'CREDENTIALS' ||
                            action.type === 'CONTENT' ||
                            action.type === 'REACTIVATE' ||
                            action.type === 'PRICE_MSG'
                    );

                    this._accountPresenceStore.setAlerts(filteredActions);
                }
                return true;
            }),
            catchError((err) => {
                this._accountPresenceStore.setIdentificationState('UNIDENTIFIED');
                return throwError(err);
            })
        );
    }

    initializeLogin(): Observable<boolean> {
        return this._updateUsecaseWorkflowService.build({ useCase: 'LOGIN' }).pipe(
            mapTo(true),
            catchError(() => of(true))
        );
    }

    private _formatName(name: string): string {
        return name
            .toLowerCase()
            .split(' ')
            .map((name) => name.charAt(0).toUpperCase() + name.substring(1))
            .join(' ');
    }
}
