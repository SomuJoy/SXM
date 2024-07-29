import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

export interface PageStepRouteConfiguration {
    totalNumberOfSteps: number;
    currentStepNumber: number;
    routeUrlNext: string;
    credentialsRouteUrl?: string;
    paymentMethodRouteUrl?: string;
    startOfFlowUrl?: string;
    confirmationUrl?: string;
}

export function GetPageStepRouteConfiguration(route: ActivatedRoute): PageStepRouteConfiguration {
    return GetPageStepRouteConfigurationFromSnapshot(route.snapshot);
}

export function GetPageStepRouteConfigurationFromSnapshot(snapshot: ActivatedRouteSnapshot): PageStepRouteConfiguration {
    const configuration: PageStepRouteConfiguration = snapshot.data?.pageStepConfiguration;
    if (!configuration) {
        throw new Error('Page step route configuration not set');
    }
    return {
        currentStepNumber: configuration.currentStepNumber,
        totalNumberOfSteps: configuration.totalNumberOfSteps,
        routeUrlNext: configuration.routeUrlNext,
        ...(configuration.credentialsRouteUrl ? { credentialsRouteUrl: configuration.credentialsRouteUrl } : {}),
        ...(configuration.paymentMethodRouteUrl ? { paymentMethodRouteUrl: configuration.paymentMethodRouteUrl } : {}),
        ...(configuration.startOfFlowUrl ? { startOfFlowUrl: configuration.startOfFlowUrl } : {}),
        ...(configuration.confirmationUrl ? { confirmationUrl: configuration.confirmationUrl } : {}),
    };
}
