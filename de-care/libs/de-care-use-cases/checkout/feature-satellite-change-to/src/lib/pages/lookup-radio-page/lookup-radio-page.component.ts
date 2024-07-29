import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { getLookupDevicePageViewModel, setSelectedRadioId } from '@de-care/de-care-use-cases/checkout/state-satellite-change-to';
import { SxmUiClosedDeviceLookupInlineFieldsWidgetComponentModule } from '@de-care/domains/identity/ui-device-lookup';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routes/page-step-route-configuration';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-lookup-radio-page',
    templateUrl: './lookup-radio-page.component.html',
    styleUrls: ['./lookup-radio-page.component.scss'],
    standalone: true,
    imports: [
        TranslateModule,
        ReactiveComponentModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SxmUiClosedDeviceLookupInlineFieldsWidgetComponentModule,
    ],
})
export class LookupRadioPageComponent implements ComponentWithLocale, OnInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    viewModel$ = this._store.select(getLookupDevicePageViewModel);
    pageStepRouteConfiguration: PageStepRouteConfiguration;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    onDeviceIdSelected(radioId: string): void {
        this._store.dispatch(setSelectedRadioId({ radioId }));
        this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute });
    }
}
