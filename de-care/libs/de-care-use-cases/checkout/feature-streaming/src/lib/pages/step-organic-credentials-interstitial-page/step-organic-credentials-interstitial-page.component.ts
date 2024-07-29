import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { loadOrganicPurchaseDataIfNotAlreadyLoadedAsync } from '@de-care/de-care-use-cases/checkout/state-streaming';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiIconStreamingModule } from '@de-care/shared/sxm-ui/ui-icon-streaming';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-organic-credentials-interstitial-page',
    templateUrl: './step-organic-credentials-interstitial-page.component.html',
    styleUrls: ['./step-organic-credentials-interstitial-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterModule, TranslateModule, SharedSxmUiUiStepperModule, SharedSxmUiUiIconStreamingModule],
})
export class StepOrganicCredentialsInterstitialPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _activatedRoute: ActivatedRoute, private readonly _store: Store) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'accountlookupinterstitialstep' }));
        this._store.dispatch(loadOrganicPurchaseDataIfNotAlreadyLoadedAsync());
    }
}
