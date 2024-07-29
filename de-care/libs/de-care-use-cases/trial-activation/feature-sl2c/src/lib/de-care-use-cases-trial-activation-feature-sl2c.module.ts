import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { CustomerInfoModule } from '@de-care/customer-info';
import { BrandingTypes, DeCareUseCasesTrialActivationStateSl2cModule } from '@de-care/de-care-use-cases/trial-activation/state-sl2c';
import { DeCareUseCasesTrialActivationUiImportantInfoModule } from '@de-care/de-care-use-cases/trial-activation/ui-important-info';
import { DeCareUseCasesTrialActivationUiPartnerShellModule, PartnerShellComponent } from '@de-care/de-care-use-cases/trial-activation/ui-partner-shell';
import { DeCareUseCasesTrialActivationUiSl2cFormModule } from '@de-care/de-care-use-cases/trial-activation/ui-sl2c-form';
import { DomainsCustomerStateAddressVerificationModule } from '@de-care/domains/customer/state-customer-verification';
import { DomainsCustomerStateLocaleModule } from '@de-care/domains/customer/state-locale';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';
import { DomainsOffersUiHeroModule } from '@de-care/domains/offers/ui-hero';
import { DomainsOffersUiOfferDetailsWrapperModule } from '@de-care/domains/offers/ui-offer-details-wrapper';
import { DomainsPartnerStatePartnerInfoModule } from '@de-care/domains/partner/state-partner-info';
import { OffersModule } from '@de-care/offers';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { SharedSxmUiUiReadyToExploreWrapperModule } from '@de-care/shared/sxm-ui/ui-ready-to-explore-wrapper';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CanActivateSl2cGuardService } from './can-activate-sl2c-guard.service';
import { DeCareUseCasesTrialActivationSl2CMainComponent } from './pages/feature-sl2c-main/feature-sl2c-main.component';
import { Sl2cPartnerNameTranslationKeyPipe } from './pages/feature-sl2c-main/partner-name-translation-key.pipe';
import { Sl2cPartnerTextTranslationKeyPipe } from './pages/feature-sl2c-main/partner-text-translation-key.pipe';
import { Sl2cOfferDetailTranslateKeyPipe } from './pages/offer-detail-translation-key.pipe';
import { DeCareUseCasesTrialActivationSl2CConfirmationComponent } from './pages/sl2c-confirmation/sl2c-confirmation.component';
import { SharedSxmUiUiHeroModule } from '@de-care/shared/sxm-ui/ui-hero';
import { SharedSxmUiUiLegalCopyModule } from '@de-care/shared/sxm-ui/ui-legal-copy';
import { UpdateUsecaseCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';

@NgModule({
    imports: [
        CommonModule,
        DomainsPartnerStatePartnerInfoModule,
        DeCareUseCasesTrialActivationUiSl2cFormModule,
        DomainsOffersStateOffersModule,
        DomainsOffersUiHeroModule,
        DomainsCustomerStateLocaleModule,
        DeCareUseCasesTrialActivationStateSl2cModule,
        DomainsOffersUiOfferDetailsWrapperModule,
        RouterModule.forChild([
            {
                path: '',
                component: PartnerShellComponent,
                children: [
                    {
                        path: 'service-lane',
                        pathMatch: 'full',
                        component: DeCareUseCasesTrialActivationSl2CMainComponent,
                        data: { brandingType: BrandingTypes.serviceLane, useCaseKey: 'SATELLITE_TRIAL', keepCustomerInfo: true },
                        canActivate: [CanActivateSl2cGuardService, UpdateUsecaseCanActivateService],
                    },
                    {
                        path: 'used-vehicle',
                        pathMatch: 'full',
                        component: DeCareUseCasesTrialActivationSl2CMainComponent,
                        data: { brandingType: BrandingTypes.usedVehicle, useCaseKey: 'SATELLITE_TRIAL', keepCustomerInfo: true },
                        canActivate: [CanActivateSl2cGuardService, UpdateUsecaseCanActivateService],
                    },
                    {
                        path: 'confirmation',
                        pathMatch: 'full',
                        component: DeCareUseCasesTrialActivationSl2CConfirmationComponent,
                    },
                ],
            },
        ]),
        TranslateModule.forChild(),
        OffersModule,
        DomainsDeviceUiRefreshDeviceModule,
        LayoutModule,
        DeCareUseCasesTrialActivationUiPartnerShellModule,
        SxmUiModule,
        DeCareUseCasesTrialActivationUiImportantInfoModule,
        DomainsCustomerStateAddressVerificationModule,
        SharedSxmUiUiReadyToExploreWrapperModule,
        CustomerInfoModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedSxmUiUiHeroModule,
        SharedSxmUiUiLegalCopyModule,
    ],
    declarations: [
        DeCareUseCasesTrialActivationSl2CMainComponent,
        DeCareUseCasesTrialActivationSl2CConfirmationComponent,
        Sl2cOfferDetailTranslateKeyPipe,
        Sl2cPartnerTextTranslationKeyPipe,
        Sl2cPartnerNameTranslationKeyPipe,
    ],
})
export class DeCareUseCasesTrialActivationFeatureSl2cModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/feature-sl2c.en-CA.json'),
            'en-US': require('./i18n/feature-sl2c.en-US.json'),
            'fr-CA': require('./i18n/feature-sl2c.fr-CA.json'),
        };
        super(translateService, languages);

        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
