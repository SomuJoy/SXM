import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getOfferInfoVM, getOfferDetailsVM, getSelectedSubscriptionIDForSAL } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { SxmLanguages } from '@de-care/shared/translation';
import { takeUntil, map } from 'rxjs/operators';
import { SettingsService } from '@de-care/settings';
import { IPProvinceQuebecWorkflow } from '@de-care/data-workflows';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';

@Component({
    selector: 'de-care-already-consolidated-without-followon',
    templateUrl: './already-consolidated-without-followon.component.html',
    styleUrls: ['./already-consolidated-without-followon.component.scss'],
})
export class AlreadyConsolidatedWithoutFollowonComponent implements OnInit, OnDestroy {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.AlreadyConsolidatedWithoutFollowonComponent.';
    packageName = 'SXM_SIR_AUD_ALLACCESS';
    offerInfoVM$ = this._store.pipe(select(getOfferInfoVM));
    offerDetailsVM$ = this._store.pipe(select(getOfferDetailsVM));
    programCode: string;
    private readonly destroy$ = new Subject<boolean>();
    currentLang: SxmLanguages;
    isChatAvailable = true;
    subscriptionID$ = this._store.select(getSelectedSubscriptionIDForSAL);

    constructor(
        private readonly _store: Store,
        private readonly _route: ActivatedRoute,
        private readonly _router: Router,
        private readonly _translateService: TranslateService,
        private readonly _settingsService: SettingsService,
        private readonly _ipProvinceQuebecWorkflow: IPProvinceQuebecWorkflow
    ) {}

    ngOnInit() {
        this.programCode = this._route.snapshot.data.programCode;
        if (this._settingsService.isCanadaMode) {
            this._translateService.onLangChange
                .pipe(
                    takeUntil(this.destroy$),
                    map((lang) => lang.lang)
                )
                .subscribe((lang) => {
                    this.currentLang = lang as SxmLanguages;
                    this.isChatAvailable = this.currentLang !== 'fr-CA';
                });
            this.isChatAvailable = this._translateService.currentLang !== 'fr-CA';
        }
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'scac', componentKey: 'errordoesnothavefollowon' }));
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    goToOffer() {
        this._router.navigate(['/subscribe/checkout/flepz'], { queryParams: { programCode: this.programCode } });
    }
}
