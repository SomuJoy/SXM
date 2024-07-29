import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getCampaignHeroViewModel, getCurrentUserViewModel, getSelectedOfferViewModel } from '@de-care/de-care-use-cases/checkout/state-streaming';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-offer-presentment-page',
    templateUrl: './step-offer-presentment-page.component.html',
    styleUrls: ['./step-offer-presentment-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepOfferPresentmentPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    campaignHeroViewModel$ = this._store.select(getCampaignHeroViewModel);
    offerViewModel$ = this._store.select(getSelectedOfferViewModel);
    getCurrentUserViewModel$ = this._store.select(getCurrentUserViewModel);
    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _activatedRoute: ActivatedRoute, private readonly _store: Store) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'offerpresentmentstep' }));
    }
}
