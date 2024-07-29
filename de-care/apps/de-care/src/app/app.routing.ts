import { inject, NgModule } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRouteSnapshot } from '@angular/router';
import { environment } from '../environments/environment';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { AllowIfNotCanadaModeCanMatchService, LoadEnvironmentInfoCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { NgxFeatureToggleCanActivateGuard } from 'ngx-feature-toggle';

const { moduleFederationRemoteEntries } = environment;
const paramsString = window.location.search.toLocaleLowerCase();
const routes: Routes = [
    {
        path: 'error',
        loadChildren: () => import('@de-care/de-care-use-cases/errors/feature-general-error-pages').then((m) => m.GeneralErrorPageComponentModule),
    },
    {
        matcher: (urlSegments) =>
            [
                'subscribe/checkout/purchase/streaming/organic/min',
                'subscribe/checkout/purchase/streaming/organic/min2',
                'subscribe/checkout/purchase/streaming/organic/variant1',
                'subscribe/checkout/purchase/streaming/organic/variant2',
            ].includes(urlSegments.join('/').toLowerCase())
                ? {
                      consumed: urlSegments,
                  }
                : null,
        pathMatch: 'full',
        redirectTo: 'subscribe/checkout/purchase/streaming/organic',
    },
    {
        path: 'subscribe/checkout/purchase/streaming/self-pay/organic',
        canActivate: [
            (route: ActivatedRouteSnapshot) => {
                return inject(NgxFeatureToggleCanActivateGuard).canActivate(route)
                    ? true
                    : inject(Router).createUrlTree(['/subscribe/checkout/purchase/streaming/organic'], { queryParams: route.queryParams });
            },
        ],
        data: {
            featureToggle: 'enableAtlasStreamingOrganicSelfPayNonAccordion',
        },
        loadChildren: () => import('@de-care/de-care-use-cases/checkout/feature-streaming-self-pay-organic').then((module) => module.routes),
    },
    {
        path: 'subscribe/checkout/purchase/streaming/organic',
        canMatch: [AllowIfNotCanadaModeCanMatchService],
        loadChildren: () =>
            import('@de-care/de-care-use-cases/checkout/feature-streaming-organic').then((module) => module.DeCareUseCasesCheckoutFeatureStreamingOrganicModule),
    },
    {
        path: 'subscribe/checkout/purchase/satellite/targeted/new',
        loadChildren: () => import('@de-care/de-care-use-cases/checkout/feature-satellite').then((module) => module.DeCareUseCasesCheckoutFeatureSatelliteTargetedModule),
    },
    {
        path: 'subscribe/checkout/purchase/satellite/organic/new',
        canActivate: [
            (route: ActivatedRouteSnapshot) => {
                return inject(NgxFeatureToggleCanActivateGuard).canActivate(route)
                    ? true
                    : inject(Router).createUrlTree(['/subscribe/checkout/purchase/satellite/organic'], { queryParams: route.queryParams });
            },
        ],
        data: {
            featureToggle: 'enableSatelliteOrganicNonAccordion',
        },
        loadChildren: () => import('@de-care/de-care-use-cases/checkout/feature-satellite').then((module) => module.DeCareUseCasesCheckoutFeatureSatelliteOrganicModule),
    },
    {
        path: 'subscribe/checkout/trial/streaming',
        canActivate: [
            (route: ActivatedRouteSnapshot) => {
                return inject(NgxFeatureToggleCanActivateGuard).canActivate(route)
                    ? true
                    : inject(Router).createUrlTree(['/subscribe/trial/streaming'], { queryParams: route.queryParams });
            },
        ],
        data: {
            featureToggle: 'enableStreamingOrganicTrialRTDNonAccordion',
        },
        loadChildren: () => import('@de-care/de-care-use-cases/checkout/feature-streaming-roll-to-drop').then((m) => m.DeCareUseCasesCheckoutFeatureStreamingRollToDropModule),
    },
    {
        path: 'subscribe/checkout/studentverification/new',
        canActivate: [
            (route: ActivatedRouteSnapshot) => {
                return inject(NgxFeatureToggleCanActivateGuard).canActivate(route)
                    ? true
                    : inject(Router).createUrlTree(['subscribe/checkout/studentverification'], { queryParams: route.queryParams });
            },
        ],
        data: {
            featureToggle: 'enableNewCheckoutStudentVerification',
        },
        loadChildren: () => import('@de-care/de-care-use-cases/checkout/feature-student-verification').then((m) => m.DeCareUseCasesCheckoutFeatureStudentVerificationModule),
    },
    {
        path: 'student/re-verify/new',
        canActivate: [
            (route: ActivatedRouteSnapshot) => {
                return inject(NgxFeatureToggleCanActivateGuard).canActivate(route)
                    ? true
                    : inject(Router).createUrlTree(['student/re-verify'], { queryParams: route.queryParams });
            },
        ],
        data: {
            featureToggle: 'enableNewCheckoutStudentReverification',
        },
        loadChildren: () =>
            import('@de-care/de-care-use-cases/checkout/feature-student-reverification').then((m) => m.DeCareUseCasesCheckoutFeatureStudentReverificationModule),
    },
    {
        path: '',
        canActivate: [LoadEnvironmentInfoCanActivateService],
        children: [
            { path: '', redirectTo: 'subscribe/checkout/flepz', pathMatch: 'full' },
            {
                path: 'account/login',
                loadChildren: () => import('@de-care/de-care-use-cases/account/feature-account-login').then((m) => m.DeCareUseCasesAccountFeatureAccountLoginModule),
            },
            {
                path: 'account/pay',
                loadChildren: () => import('@de-care/de-care-use-cases/account/feature-payment').then((m) => m.DeCareUseCasesAccountFeaturePaymentModule),
            },
            {
                path: 'subscribe/checkout/promotion',
                loadChildren: () => import('@de-care/de-care-use-cases/checkout/feature-zero-cost').then((module) => module.DeCareUseCasesCheckoutFeatureZeroCostModule),
            },
            {
                path: 'subscribe/checkout/upgrade',
                loadChildren: () => import('@de-care/de-care-use-cases/checkout/feature-upgrade').then((module) => module.DeCareUseCasesCheckoutFeatureUpgradeModule),
            },
            {
                path: 'subscribe/upgrade-vip',
                loadChildren: () => import('@de-care/de-care-use-cases/checkout/feature-upgrade-vip').then((m) => m.DeCareUseCasesCheckoutFeatureUpgradeVipModule),
            },
            {
                path: 'account/manage',
                loadChildren: () => import('@de-care/de-care-use-cases/account/feature-my-account').then((m) => m.DeCareUseCasesAccountFeatureMyAccountModule),
            },
            {
                path: 'onboarding',
                ...(moduleFederationRemoteEntries?.['de_care_use_cases_onboarding']
                    ? {
                          loadChildren: () =>
                              loadRemoteModule({
                                  remoteName: 'de_care_use_cases_onboarding',
                                  exposedModule: './Module',
                              }).then((m) => m.RemoteEntryModule),
                      }
                    : {
                          loadChildren: () =>
                              import('@de-care/de-care-use-cases/streaming/feature-setup-credentials').then((m) => m.DeCareUseCasesStreamingFeatureSetupCredentialsModule),
                      }),
            },
            {
                path: 'subscribe/checkout/purchase/streaming',
                loadChildren: () => import('@de-care/de-care-use-cases/checkout/feature-streaming').then((module) => module.DeCareUseCasesCheckoutFeatureStreamingModule),
            },
            {
                path: 'subscribe/checkout/purchase/satellite',
                loadChildren: () => import('@de-care/de-care-use-cases/checkout/feature-satellite').then((module) => module.DeCareUseCasesCheckoutFeatureSatelliteModule),
            },
            {
                path: 'subscribe/checkout/purchase/satellite/add-radio-router',
                loadChildren: () =>
                    import('@de-care/de-care-use-cases/checkout/feature-add-radio-router').then((module) => module.DeCareUseCasesCheckoutFeatureAddRadioRouterModule),
            },
            {
                matcher: (urlSegments) => {
                    if (urlSegments.join('/').match(/subscribe\/checkout\/flepz$/gm) && paramsString.includes('renewalcode=choice')) {
                        return {
                            consumed: urlSegments,
                        };
                    }
                    return null;
                },
                redirectTo: 'subscribe/checkout/renewal/flepz',
                pathMatch: 'full',
            },
            {
                matcher: (urlSegments) => {
                    if (urlSegments.join('/').match(/subscribe\/checkout$/gm) && paramsString.includes('renewalcode=choice') && !_checkProactiveFlag(urlSegments)) {
                        return {
                            consumed: urlSegments,
                        };
                    }
                    return null;
                },
                redirectTo: 'subscribe/checkout/renewal',
                pathMatch: 'full',
            },
            {
                path: 'account/credentials',
                loadChildren: () =>
                    import('@de-care/de-care-use-cases/account/feature-account-credentials-management').then(
                        (m) => m.DeCareUseCasesAccountFeatureAccountCredentialsManagementModule
                    ),
            },
            { path: 'account', loadChildren: () => import('@de-care/de-care-use-cases/account/main').then((m) => m.DeCareUseCasesAccountMainModule) },
            {
                path: 'subscribe/checkout/renewal/flepz',
                loadChildren: () => import('@de-care/de-care-use-cases/roll-to-choice/main').then((m) => m.DeCareUseCasesRollToChoiceMainModule),
            },
            {
                path: 'subscribe/checkout/offer/flepz',
                loadChildren: () => import('@de-care/de-care-use-cases/pick-a-plan/main').then((m) => m.DeCareUseCasesPickAPlanMainModule),
            },
            {
                path: 'activate',
                loadChildren: () => import('@de-care/de-care-use-cases/trial-activation/main').then((m) => m.DeCareUseCasesTrialActivationMainModule),
            },
            {
                path: 'subscribe/checkout/studentverification',
                loadChildren: () => import('@de-care/de-care-use-cases/student-verification/main').then((m) => m.DeCareUseCasesStudentVerificationMainModule),
            },
            {
                path: 'subscribe/oneclick',
                loadChildren: () => import('@de-care/de-care-use-cases/trial-activation/feature-legacy').then((m) => m.TrialActivationModule),
            },
            {
                path: 'subscribe/trial',
                loadChildren: () => import('@de-care/de-care-use-cases/roll-to-drop/main').then((m) => m.DeCareUseCasesRollToDropMainModule),
            },
            {
                path: 'subscribe/entitlement',
                loadChildren: () => import('@de-care/de-care-use-cases/third-party-billing/main').then((m) => m.DeCareUseCasesThirdPartyBillingMainModule),
            },
            {
                path: 'amzauth',
                redirectTo: 'subscribe/linking/device-link-amazon/amzauth',
            },
            {
                path: 'subscribe/linking',
                loadChildren: () => import('@de-care/de-care-use-cases/third-party-linking/main').then((m) => m.DeCareUseCasesThirdPartyLinkingMainModule),
            },
            {
                path: 'subscribe/linking/device-link-google',

                loadChildren: () =>
                    import('@de-care/de-care-use-cases/third-party-linking/feature-device-link-google').then(
                        (m) => m.DeCareUseCasesThirdPartyLinkingFeatureDeviceLinkGoogleModule
                    ),
            },
            {
                path: 'subscribe',
                loadChildren: () => import('@de-care/checkout').then((m) => m.CheckoutModule),
            },
            {
                path: 'donotcall',
                loadChildren: () => import('@de-care/do-not-call').then((m) => m.DoNotCallModule),
            },
            {
                path: 'subscription/change',
                loadChildren: () => import('@de-care/de-care-use-cases/change-subscription/main').then((m) => m.DeCareUseCasesChangeSubscriptionMainModule),
            },
            {
                path: 'subscription/change-term',
                data: { changeTermOnly: true },
                loadChildren: () => import('@de-care/de-care-use-cases/change-subscription/main').then((m) => m.DeCareUseCasesChangeSubscriptionMainModule),
            },
            {
                path: 'subscription/cancel',
                loadChildren: () => import('@de-care/de-care-use-cases/cancel-subscription/main').then((m) => m.DeCareUseCasesCancelSubscriptionMainModule),
            },
            {
                path: 'student',
                loadChildren: () => import('@de-care/de-care-use-cases/student-verification/main').then((m) => m.DeCareUseCasesStudentVerificationMainModule),
            },
            {
                path: 'transfer',
                loadChildren: () => import('@de-care/de-care-use-cases/transfer/main').then((m) => m.DeCareUseCasesTransferMainModule),
            },
            {
                path: 'account/info-collection',
                loadChildren: () =>
                    import('@de-care/de-care-use-cases/account/feature-info-customer-collection').then((m) => m.DeCareUseCasesAccountFeatureInfoCustomerCollectionModule),
            },
            {
                path: 'subscribe/refresh-signal',
                loadChildren: () =>
                    import('@de-care/de-care-use-cases/subscription/feature-refresh-radio-signal').then((m) => m.DeCareUseCasesSubscriptionFeatureRefreshRadioSignalModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}

// Matrix parameter "proactiveFlag" is used in /subscribe/checkout path to avoid the redirection to proactive rtc choice flow when customer is already in proactive flow.
function _checkProactiveFlag(urlSegments): boolean {
    return urlSegments && Array.isArray(urlSegments) && urlSegments.length >= 2 ? urlSegments[1].parameters?.proactiveFlag : null;
}
