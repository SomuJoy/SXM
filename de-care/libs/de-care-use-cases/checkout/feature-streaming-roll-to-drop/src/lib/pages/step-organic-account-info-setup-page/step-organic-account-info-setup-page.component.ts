import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
    getOrganicAccountInfoViewModel,
    skipUpdateOfferOnProvinceChange,
    SubmitNewAccountPurchaseOrganicTransactionWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-streaming-roll-to-drop';
import { AccountInfoAndZipFormFieldData, AccountInfoAndZipFormFieldPageComponent, DeCareUseCasesCheckoutUiCommonModule } from '@de-care/de-care-use-cases/checkout/ui-common';
import { ProvinceSelection, PROVINCE_SELECTION } from '@de-care/de-care/shared/ui-province-selection';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';

import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../page-step-route-configuration';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-step-organic-account-info-setup-page',
    templateUrl: './step-organic-account-info-setup-page.component.html',
    styleUrls: ['./step-organic-account-info-setup-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        SharedSxmUiUiStepperModule,
        TranslateModule,
        ReactiveComponentModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        DeCareUseCasesCheckoutUiCommonModule,
        AccountInfoAndZipFormFieldPageComponent,
    ],
})
export class StepOrganicAccountInfoSetupPageComponent implements ComponentWithLocale, AfterViewInit, OnInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    getOrganicAccountInfoViewModel$ = this._store.select(getOrganicAccountInfoViewModel);
    private readonly shouldPresentRenewal$ = this.getOrganicAccountInfoViewModel$.pipe(map((info) => info.shouldPresentRenewal));
    pageStepRouteConfiguration: PageStepRouteConfiguration;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _submitNewAccountPurchaseOrganicTransactionWorkflowService: SubmitNewAccountPurchaseOrganicTransactionWorkflowService,
        @Inject(PROVINCE_SELECTION) private readonly _provinceSelection: ProvinceSelection,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router
    ) {
        translationsForComponentService.init(this);
    }

    onformCompleted(accountInfo: AccountInfoAndZipFormFieldData) {
        const isCanadaCountry = accountInfo?.country?.toUpperCase() === 'CA';
        const isProvinceUpdated$ = isCanadaCountry
            ? this._provinceSelection.selectedProvince$.pipe(
                  take(1),
                  map((currentProvice) => currentProvice.toLowerCase() !== accountInfo.state.toLowerCase())
              )
            : of(false);

        isProvinceUpdated$
            .pipe(
                tap((isProvinceUpdated) => {
                    if (isProvinceUpdated) {
                        this._store.dispatch(skipUpdateOfferOnProvinceChange());
                        this._provinceSelection?.setSelectedProvince(accountInfo.state);
                    }
                    isCanadaCountry && this._provinceSelection?.setProvinceCanBeChanged(false);
                }),
                concatMap((isProvinceUpdated) => {
                    const { zip: postalCode, addressLine1: streetAddress, phoneNumber: phone, avsValidated, ...purchaseParams } = accountInfo;
                    return this._submitNewAccountPurchaseOrganicTransactionWorkflowService.build({
                        accountInfo: {
                            ...purchaseParams,
                            streetAddress,
                            postalCode,
                            phone,
                            avsvalidated: avsValidated,
                        },
                        updateOffer: isProvinceUpdated,
                    });
                })
            )
            .subscribe({
                next: () => this.goToNextStep(),
                error: () => {
                    // TODO: Handle error stuff here
                },
            });
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'accounInfoSetupStep' }));
    }

    private goToNextStep() {
        this.shouldPresentRenewal$.pipe(take(1)).subscribe((shouldPresentRenewal) => {
            let nextUrl = this.pageStepRouteConfiguration.routeUrlNext;
            if (!shouldPresentRenewal) {
                nextUrl = this.pageStepRouteConfiguration.confirmationUrl;
            }
            this._router.navigate([nextUrl], { queryParamsHandling: 'preserve', relativeTo: this._activatedRoute });
        });
    }
}
