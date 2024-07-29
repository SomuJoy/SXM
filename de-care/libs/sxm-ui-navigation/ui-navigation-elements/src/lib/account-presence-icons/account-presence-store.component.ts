import { Injectable } from '@angular/core';
import { IdentificationState, NextBestAction } from '@de-care/domains/account/state-next-best-actions';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PresenceState {
    nbaActions: NextBestAction[];
    alerts: NextBestAction[];
    firstName: string;
    loading: boolean;
    identificationState: IdentificationState;
    nextBillingPaymentDate: string;
    billingSummaryAmountDue: number;
}

const defaultState: PresenceState = {
    nbaActions: [],
    alerts: [],
    firstName: '',
    loading: false,
    identificationState: null,
    nextBillingPaymentDate: null,
    billingSummaryAmountDue: null,
};

@Injectable()
export class AccountPresenceStore extends ComponentStore<PresenceState> {
    constructor() {
        super(defaultState);
    }

    // Selectors
    readonly firstName$ = this.select(({ firstName }) => firstName);
    readonly alerts$ = this.select(({ alerts }) => alerts);
    readonly alertsToDisplay$ = this.select(({ alerts }) => alerts?.slice(0, 3));
    readonly alertTypes$ = this.select(({ alerts }) => alerts?.map((alert: NextBestAction) => alert.type));
    readonly loading$ = this.select(({ loading }) => loading);
    readonly identificationState$ = this.select(({ identificationState }) => identificationState);
    readonly alertCount$ = this.select(this.alertsToDisplay$, (alerts) => alerts?.length);
    readonly isAlertCritical$ = this.select(this.alerts$, (alerts) => alerts?.[0]?.type === 'PAYMENT');
    readonly nextBillingPaymentDate$ = this.select(({ nextBillingPaymentDate }) => nextBillingPaymentDate);
    readonly billingSummaryAmountDue$ = this.select(({ billingSummaryAmountDue }) => billingSummaryAmountDue);
    readonly convertTrialEndDate$ = this.select(({ alerts }) => alerts.find((alert) => alert?.endDate && alert?.type === 'CONVERT')?.endDate);

    // Reducers
    readonly setFirstName = this.updater((state, firstName: string | null) => ({
        ...state,
        firstName: firstName || '',
    }));

    readonly setNextBillingPaymentDate = this.updater((state, nextBillingPaymentDate: string | null) => ({
        ...state,
        nextBillingPaymentDate: nextBillingPaymentDate || null,
    }));

    readonly setAccountBillingSummaryAmountDue = this.updater((state, billingSummaryAmountDue: number | null) => ({
        ...state,
        billingSummaryAmountDue: billingSummaryAmountDue || null,
    }));

    readonly setNbaActions = this.updater((state, nbaActions: NextBestAction[] | null) => ({
        ...state,
        nbaActions: nbaActions || [],
    }));

    readonly setloading = this.updater((state, loading: boolean | null) => ({
        ...state,
        loading: loading || false,
    }));

    readonly setIdentificationState = this.updater((state, identificationState: IdentificationState | null) => ({
        ...state,
        identificationState: identificationState || null,
    }));

    // Effects
    readonly setAlerts = this.effect((alerts$: Observable<NextBestAction[]>) => {
        return alerts$.pipe(
            map((alerts: NextBestAction[]) => {
                this.patchState({ alerts: alerts });
            })
        );
    });
}
