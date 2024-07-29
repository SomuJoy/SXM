import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { getCampaignHeroViewModel, getSelectedOfferForPresentmentViewModel, getVehicleInfoVM } from '@de-care/de-care-use-cases/checkout/state-satellite';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SxmUiVehicleYmmInfoComponentModule } from '@de-care/shared/sxm-ui/ui-vehicle-ymm-info';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiDealAddonCardModule } from '@de-care/shared/sxm-ui/ui-deal-addon-card';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveComponentModule } from '@ngrx/component';

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
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveComponentModule,
        TranslateModule,
        SxmUiVehicleYmmInfoComponentModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiUiDealAddonCardModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
})
export class StepOfferPresentmentPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    campaignHeroViewModel$ = this._store.select(getCampaignHeroViewModel);
    vehicleInfoVM$ = this._store.select(getVehicleInfoVM);
    offerViewModel$ = this._store.select(getSelectedOfferForPresentmentViewModel).pipe(
        map((viewModel) => {
            // Note: we are overriding the presentation and footer here to fulfill the A/B test requirements (DEX-46911)
            return {
                ...viewModel,
                offerDescription: {
                    ...viewModel.offerDescription,
                    presentation: 'Presentation5',
                    footer: null,
                },
            };
        })
    );

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
