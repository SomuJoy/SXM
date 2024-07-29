import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import {
    getOffersAreMrd,
    getSelectedOfferOfferInfoLegalCopy,
    getOffersMrdSelectionData,
    setMrdSelectedPlanCode,
    getSelectedPlanCode,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'pick-an-mrd-plan-step',
    templateUrl: './step-pick-a-plan-mrd-page.component.html',
    styleUrls: ['./step-pick-a-plan-mrd-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepPickAPlanMrdPageComponent implements ComponentWithLocale, OnInit, OnDestroy, AfterViewInit {
    getOffersAreMrd$ = this._store.select(getOffersAreMrd);
    getSelectedOfferOfferInfoLegalCopy$ = this._store.select(getSelectedOfferOfferInfoLegalCopy);
    getSelectedPlanCode$ = this._store.select(getSelectedPlanCode);
    multiOfferSelectionData$;
    mrdEligible = false;
    displayIneligibleLoader$ = new BehaviorSubject(false);
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store,
        private _translateService: TranslateService
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.getOffersAreMrd$.pipe(takeUntil(this._destroy$)).subscribe((offersMrdEligible) => {
            this.mrdEligible = offersMrdEligible;
            if (!offersMrdEligible) {
                this.displayIneligibleLoader$.next(true);
                timer(5000).subscribe(() => {
                    this.displayIneligibleLoader$.next(false);
                });
            }
        });
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
        this.multiOfferSelectionData$ = this._store.pipe(
            select(getOffersMrdSelectionData),
            map(({ mainPackageData }) => ({
                mainOffers: mainPackageData.map((packageData) => {
                    return {
                        ...(packageData.isBestPackage && {
                            headlineFlagCopy: this._translateService.instant(`${this.translateKeyPrefix}.PACKAGE_SELECTION_STEP`),
                        }),
                        fieldLabel: this._translateService.instant(`${this.translateKeyPrefix}.CONTENT_CARD_HEADLINE`),
                        planCodeOptions: [
                            {
                                planCode: packageData.planCode,
                            },
                        ],
                        packageData: packageData.data,
                    };
                }),
            }))
        );
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'AUTHENTICATE', componentKey: 'offerpresentmentstep' }));
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    submitForm({ planCode }) {
        this._store.dispatch(setMrdSelectedPlanCode({ planCode }));
        this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }

    selectedPlan({ planCode }) {
        this._store.dispatch(setMrdSelectedPlanCode({ planCode }));
    }
}
