import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import {
    GetDeviceStatusForRouterWorkflowService,
    GetDeviceStatusForRouterWorkflowServiceErrors,
    getLookupDevicePageViewModel,
    LoadOffersCustomerForAddRadioWorkflowService,
    setSelectedRadioId,
    getDeviceInfo,
} from '@de-care/de-care-use-cases/checkout/state-add-radio-router';
import { SxmUiClosedDeviceLookupInlineFieldsWidgetComponentModule } from '@de-care/domains/identity/ui-device-lookup';
import { SharedSxmUiUiLoadingOverlayModule } from '@de-care/shared/sxm-ui/ui-loading-overlay';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
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
        CommonModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiStepperModule,
        SxmUiClosedDeviceLookupInlineFieldsWidgetComponentModule,
        SharedSxmUiUiLoadingOverlayModule,
    ],
})
export class LookupRadioPageComponent implements ComponentWithLocale, OnInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    viewModel$ = this._store.select(getLookupDevicePageViewModel);
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    showFullViewLoader$ = new BehaviorSubject(false);

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _getDeviceStatusForRouterWorkflowService: GetDeviceStatusForRouterWorkflowService,
        private readonly _loadOffersCustomerForAddRadioWorkflowService: LoadOffersCustomerForAddRadioWorkflowService
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    onDeviceIdSelected(radioId: string): void {
        this.showFullViewLoader$.next(true);
        this._store.dispatch(setSelectedRadioId({ radioId }));
        this._getDeviceStatusForRouterWorkflowService.build().subscribe({
            next: (result) => {
                if (result === 'ESN not in use') {
                    this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute });
                } else if (result === 'AC_SC') {
                    this._store
                        .select(getDeviceInfo)
                        .pipe(
                            take(1),
                            tap(({ radioId }) => this._router.navigate(['/transfer/radio'], { queryParams: { trialradioid: radioId } }))
                        )
                        .subscribe();
                } else {
                    //TBD
                    this._router.navigate(['/subscribe/checkout/flepz']);
                }
            },
            error: (error: GetDeviceStatusForRouterWorkflowServiceErrors) => {
                this.showFullViewLoader$.next(false);
                if (error && error === 'TRANSFER_ERROR') {
                    this._router.navigate(['/transfer/radio/error']);
                } else if (error) {
                    this._router.createUrlTree(['/error']);
                }
            },
        });
    }
}
