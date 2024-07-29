// ===============================================================================
// Angular
import { Type } from '@angular/core';

//********************************************************************************
export interface ICanComponentDeactivate {
    canDeactivate: () => boolean | Promise<boolean>; // | Observable<boolean>;
}

// Dynamic Routes - Root
export interface IDynamicRoute {
    id: string;

    authRequiredModules: [
        {
            moduleName: string;
        }
    ];

    defaultRedirects: {
        defaultUrl: string;
        authRegister: string;
        firstPaymentCompUrl: string;
        error500Url: string;
    };

    appRoutes: [IDynamicRouteModule];
}

// Dynamic Routes - Modules
export interface IDynamicRouteModule {
    moduleName: string;
    sortOrder: number;
    desc: string;
    isAuthRequired: boolean;
    moduleGeo: {
        previous: string;
        next: string;
    };
    components: [IDynamicRouteComponent];
}

// Dynamic Routes - Component
export interface IDynamicRouteComponent {
    componentName: string;
    sortOrder: number;
    componentRoute: string;
    isAuthRequired: boolean;
    redirects: {
        next: string;
        back: string;
    };
}

// AB Testing Dynamic Component Loading
export interface IModuleComponents {
    name: string;
    component: {
        default: Type<any>;
        variants?: Type<any>[];
    };
    isABTesting: boolean;
    flowName?: string;
    stepName?: string;
}

// AppDynamics Error message
export interface IAppDynamicsError {
    message: string;
    line?: number;
}
