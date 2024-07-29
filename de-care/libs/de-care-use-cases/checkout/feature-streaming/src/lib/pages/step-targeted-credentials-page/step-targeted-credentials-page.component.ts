import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { ActivatedRoute, Router } from '@angular/router';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import {
    getOfferIncludesFees,
    getQuebecProvince,
    getSelectedOfferViewModel,
    getSelectedPlanMrdEligible,
    setUserEnteredCredentials,
    getUserEnteredCredentials,
    getPlanRecapCardViewModel,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { DeCareUseCasesCheckoutUiCommonModule } from '@de-care/de-care-use-cases/checkout/ui-common';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-targeted-credentials-page',
    templateUrl: './step-targeted-credentials-page.component.html',
    styleUrls: ['./step-targeted-credentials-page.component.scss'],
    standalone: true,
    imports: [CommonModule, TranslateModule, SharedSxmUiUiStepperModule, SharedSxmUiUiPrimaryPackageCardModule, DeCareUseCasesCheckoutUiCommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepTargetedCredentialsPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    offerViewModel$ = this._store.select(getSelectedOfferViewModel);
    offerDealCopyViewModel$ = this.offerViewModel$.pipe(map((offerViewModel) => (offerViewModel ? { offerDealCopy: offerViewModel?.offerDealCopy?.[0] } : null)));
    getUserEnteredCredentials$ = this._store.select(getUserEnteredCredentials);
    planRecapCardViewModel$ = this._store.select(getPlanRecapCardViewModel);
    isQuebecProvince$ = this._store.select(getQuebecProvince);
    isOfferIncludeFee$ = this._store.select(getOfferIncludesFees);
    getSelectedPlanMrdEligible$ = this._store.select(getSelectedPlanMrdEligible);

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'createusername' }));
    }

    submitForm(credentials: { userName: string; password: string }) {
        this._store.dispatch(setUserEnteredCredentials(credentials));
        this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }
}
