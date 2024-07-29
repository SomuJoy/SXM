import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, UrlSegment } from '@angular/router';
import {
    UpdateUsecaseCanActivateService,
    LoadPackageDescriptionsCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DeCareUseCasesSharedUiShellModule, ShellComponent, ShellComponentTheming, ShellComponentThemingFooterBorder } from '@de-care/de-care-use-cases/shared/ui-shell';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
import { FeatureFlagCanActivateGuardService } from '@de-care/shared/state-feature-flags';

function consumedUrlSegmentsWithoutLastOne(urlSegments: UrlSegment[]): UrlSegment[] {
    return urlSegments.slice(0, -1);
}

@NgModule({
    imports: [
        CommonModule,
        DeCareUseCasesSharedUiShellModule,
        DomainsOffersStatePackageDescriptionsModule,
        RouterModule.forChild([
            {
                path: '',
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, LoadPackageDescriptionsCanActivateService],
                children: [
                    {
                        path: 'trial/ast',
                        component: ShellComponent,
                        canActivate: [UpdateUsecaseCanActivateService],
                        data: {
                            useCaseKey: 'SATELLITE_TRIAL',
                            keepCustomerInfo: true,
                            theming: {
                                footer: {
                                    border: ShellComponentThemingFooterBorder.NONE,
                                },
                            } as ShellComponentTheming,
                        },
                        loadChildren: () =>
                            import('@de-care/de-care-use-cases/trial-activation/feature-ad-supported-tier-one-click').then(
                                (m) => m.DeCareUseCasesTrialActivationFeatureAdSupportedTierOneClickModule
                            ),
                    },
                    {
                        matcher: (urlSegments) => {
                            if (urlSegments.join('/').match(/trial\/(service-lane|used-vehicle|confirmation)$/gm)) {
                                // We need to tell the router that we matched everything up to
                                //  the final segment (sl2c feature handles that segment)
                                //  so that it knows not to try and match again, so we
                                //  return consumed as everything but the segment that sl2c feature handles
                                return {
                                    consumed: consumedUrlSegmentsWithoutLastOne(urlSegments),
                                };
                            }
                            return null;
                        },
                        canActivate: [FeatureFlagCanActivateGuardService],
                        data: {
                            featureToggle: 'enableSl2c',
                        },
                        loadChildren: () => import('@de-care/de-care-use-cases/trial-activation/feature-sl2c').then((m) => m.DeCareUseCasesTrialActivationFeatureSl2cModule),
                    },
                    {
                        path: 'trial/rtp',
                        component: ShellComponent,
                        canActivate: [UpdateUsecaseCanActivateService],
                        data: { useCaseKey: 'SATELLITE_TRIAL', keepCustomerInfo: true },
                        loadChildren: () => import('@de-care/de-care-use-cases/trial-activation/rtp/main').then((m) => m.DeCareUseCasesTrialActivationRtpMainModule),
                    },
                    {
                        path: '',
                        component: ShellComponent,
                        loadChildren: () => import('@de-care/de-care-use-cases/trial-activation/feature-legacy').then((m) => m.TrialActivationModule),
                    },
                ],
            },
        ]),
    ],
})
export class DeCareUseCasesTrialActivationMainModule {}
