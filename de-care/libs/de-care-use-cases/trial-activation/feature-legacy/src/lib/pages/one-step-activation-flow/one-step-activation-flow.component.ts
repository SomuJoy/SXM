import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { SxmLanguages } from '@de-care/app-common';
import { UserEnteredCustomerInfo } from '@de-care/customer-state';
import { OneStepActivationProspectModel, PackageModel, SweepstakesModel, VehicleModel } from '@de-care/data-services';
import { getOfferDetails } from '@de-care/de-care-use-cases/trial-activation/state-legacy';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getCountry, getLanguage } from '@de-care/domains/customer/state-locale';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AccountData } from '../../page-parts/new-account-form-step/new-account-form-step.component';
import { OneStepActivationFlowService } from './one-step-activation-flow.service';

@Component({
    selector: 'one-step-activation-flow',
    templateUrl: './one-step-activation-flow.component.html',
    styleUrls: ['./one-step-activation-flow.component.scss'],
    providers: [OneStepActivationFlowService],
})
export class OneStepActivationFlowComponent implements OnInit, OnDestroy, AfterViewInit {
    offer: PackageModel;
    displayNucaptcha = false;
    vehicleInfo: VehicleModel;
    termLength: number;
    isLoading = false;
    hasSubmissionError = false;
    passwordPolicyIssue = false;
    radioId = '';
    sweepstakesInfo: SweepstakesModel | undefined;
    prospectData: OneStepActivationProspectModel;
    returnUrl: string;
    _window: Window;

    lang$ = this._store.pipe(select(getLanguage));
    country$ = this._store.pipe(select(getCountry));
    offerDetails$ = this._store.pipe(select(getOfferDetails));

    private readonly _destroy$ = new Subject<boolean>();

    constructor(
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _oneStepActivationFlowService: OneStepActivationFlowService,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _store: Store,
        private _router: Router,
        @Inject(DOCUMENT) _document: Document
    ) {
        this._window = _document.defaultView;
    }

    ngOnInit(): void {
        this._activatedRoute.data
            .pipe(
                tap<Data>((data) => {
                    this.sweepstakesInfo = data.sweepstakesInfo;

                    if (!!data.offerData) {
                        const offer = data.offerData.offer;
                        this.displayNucaptcha = data.offerData.displayNucaptcha;
                        if (offer) {
                            this.offer = offer;
                            this.termLength = offer.termLength;
                        }
                        this.radioId = data.offerData.radioId;
                        this._oneStepActivationFlowService.initializeDataLayer(this.radioId);

                        if (!!data.vehicleInfo) {
                            this.vehicleInfo = data.vehicleInfo;
                        }
                    }

                    this.prospectData = <UserEnteredCustomerInfo>data.customerInfo;
                    this.returnUrl = data.returnUrl;
                }),
                takeUntil(this._destroy$)
            )
            .subscribe();
    }

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    onNewAccountFormSubmit(accountData: AccountData, lang: SxmLanguages) {
        this.isLoading = true;
        this.hasSubmissionError = false;
        this._oneStepActivationFlowService.activateNewAccount(accountData, this.radioId, this.offer, lang, this.sweepstakesInfo).subscribe({
            next: () => {
                this.isLoading = false;
                this.hasSubmissionError = false;
                this._changeDetectorRef.markForCheck();
            },
            error: (e) => {
                this.isLoading = false;
                if (e.error && e.error.error && e.error.error.errorPropKey === 'error.purchase.service.invalid.password') {
                    this.passwordPolicyIssue = true;
                } else {
                    this.hasSubmissionError = true;
                }
                this._changeDetectorRef.markForCheck();
            },
        });
    }

    notYourCarClick() {
        if (this.returnUrl) {
            const url = new URL(this.returnUrl);
            if (url.hostname.endsWith('siriusxm.com') || url.hostname.endsWith('siriusxm.ca')) {
                this._window.location.href = this.returnUrl;
            } else {
                this._router.navigate(['/error']);
            }
        }
    }
}
