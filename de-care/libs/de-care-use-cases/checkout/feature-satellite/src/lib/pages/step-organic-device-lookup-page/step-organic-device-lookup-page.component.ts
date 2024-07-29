import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { suspensify } from '@jscutlery/operators';
import { tap, take } from 'rxjs/operators';
import {
    flepzResultsVM,
    getOrganicDeviceLookupPageViewModel,
    LoadAccountAndDeviceInfoWorkflowService,
    LoadAccountAndDeviceInfoWorkflowServiceErrors,
    LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService,
    LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors,
    searchResultsDisplayInfo,
    setSelectedRadioId,
} from '@de-care/de-care-use-cases/checkout/state-satellite';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SxmUiSkeletonLoaderPanelComponentModule, SxmUiSkeletonLoaderTextCopyComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { ReactiveComponentModule } from '@ngrx/component';
import { SharedSxmUiUiTabsModule } from '@de-care/shared/sxm-ui/ui-tabs';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { FlepzLookupComponent } from '@de-care/domains/identity/ui-flepz-lookup-form';
import { UiRadioLookupComponent } from '@de-care/domains/identity/ui-radio-lookup';
import { SharedSxmUiUiModalModule, SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { SxmUiActiveSubscriptionFoundComponent, SxmUiDeviceFoundComponent, SxmUiMultipleDevicesFoundComponent } from '@de-care/shared/sxm-ui/ui-device-lookup-results';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-organic-device-lookup-page',
    templateUrl: './step-organic-device-lookup-page.component.html',
    styleUrls: ['./step-organic-device-lookup-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        SharedSxmUiUiStepperModule,
        ReactiveComponentModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiTabsModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SxmUiSkeletonLoaderPanelComponentModule,
        SxmUiSkeletonLoaderTextCopyComponentModule,
        FlepzLookupComponent,
        SxmUiDeviceFoundComponent,
        SxmUiMultipleDevicesFoundComponent,
        SxmUiActiveSubscriptionFoundComponent,
        UiRadioLookupComponent,
        SharedSxmUiUiModalModule,
    ],
})
export class StepOrganicDeviceLookupPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    viewModel$ = this._store.select(getOrganicDeviceLookupPageViewModel);
    offerLoad$ = this._loadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService.build().pipe(
        suspensify(),
        tap(({ error }: { error: LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors }) => {
            if (error) {
                switch (error) {
                    case 'LEGACY_FLOW_REQUIRED': {
                        this._router.navigate(['subscribe/checkout/flepz'], { queryParams: this._activatedRoute.snapshot.queryParams });
                        break;
                    }
                    case 'PROMO_CODE_EXPIRED':
                        this._router.navigate(['/subscribe/checkout/purchase/satellite/expired-offer-error'], { replaceUrl: true });
                        break;
                    case 'PROMO_CODE_INVALID':
                        this._router.navigate(['/subscribe/checkout/purchase/satellite/generic-error'], { replaceUrl: true });
                        break;
                    case 'PROMO_CODE_REDEEMED':
                        this._router.navigate(['/subscribe/checkout/purchase/satellite/promo-code-redeemed-error'], { replaceUrl: true });
                        break;
                    case 'SYSTEM':
                    default:
                        this._router.navigate(['error']);
                        break;
                }
            }
        })
    );

    flepzResultsVM$ = this._store.select(flepzResultsVM);

    @ViewChild('multipleDevicesFoundModal') private readonly _multipleDevicesFoundModal: SxmUiModalComponent;
    @ViewChild('deviceFoundModal') private readonly _deviceFoundModal: SxmUiModalComponent;
    @ViewChild('activeSubscriptionFoundModal') private readonly _activeSubscriptionFoundModal: SxmUiModalComponent;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store,
        private readonly _loadAccountAndDeviceInfoWorkflowService: LoadAccountAndDeviceInfoWorkflowService,
        private readonly _loadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService: LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        // TODO: add componentname string value here
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }

    showFlepzResultsData() {
        this._store
            .select(searchResultsDisplayInfo)
            .pipe(take(1))
            .subscribe({
                next: (data) => {
                    if (data.showMultipleDevicesFound) {
                        this.showMultipleDevicesFoundModal();
                    } else if (data.showActiveSubscriptionFound) {
                        this.showActiveSubscriptionFoundModal();
                    } else if (data.showDeviceFound) {
                        this.showDeviceFoundModal();
                    }
                },
                error: () => {
                    //TBD
                },
            });
    }

    showMultipleDevicesFoundModal() {
        this._multipleDevicesFoundModal.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'multipleDevicesFoundModal' }));
    }

    showDeviceFoundModal() {
        this._deviceFoundModal.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'deviceFoundModal' }));
    }

    showActiveSubscriptionFoundModal() {
        this._activeSubscriptionFoundModal.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'activeSubscriptionFoundModal' }));
    }

    onDeviceFoundClosed() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'flepzLookupForm' }));
    }

    onTryAgainClicked(modalName) {
        if (modalName === 'multipleDevicesFoundModal') {
            this._multipleDevicesFoundModal.close();
        } else if (modalName === 'deviceFoundModal') {
            this._deviceFoundModal.close();
        } else if (modalName === 'activeSubscriptionFoundModal') {
            this._activeSubscriptionFoundModal.close();
        }
        this.onDeviceFoundClosed();
    }

    onDeviceSelected(radioId: string) {
        // TODO: call a new feature state workflow that will take in the selected device id
        //       if success, then route to next step
        //       if error, look at error type from workflow
        //           (will need an error to indicate platform change notice so this page can display that)
        this._store.dispatch(setSelectedRadioId({ radioId }));
        this._loadAccountAndDeviceInfoWorkflowService.build().subscribe({
            next: () => {
                this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute });
            },
            error: (error: LoadAccountAndDeviceInfoWorkflowServiceErrors) => {
                if (error) {
                    this._router.createUrlTree(['/error']);
                }
            },
        });
    }

    setRadioIdSelectedAndContinue(radioId: string) {
        // TODO: call a feature state workflow service that handles setting radio id and loading account non-pii data
        //       and on success route to next step
        this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute });
    }
}
