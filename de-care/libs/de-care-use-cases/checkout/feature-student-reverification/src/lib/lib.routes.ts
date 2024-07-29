import { Route } from '@angular/router';
import { LoadIpLocationAndSetProvinceSyncCanActivateService, TurnOffFullPageLoaderCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';

export const routes: Route[] = [
    {
        path: '',
        data: { pageShellBasic: { allowProvinceBar: true } as PageShellBasicRouteConfiguration },
        component: PageShellBasicComponent,
        canActivate: [TurnOffFullPageLoaderCanActivateService, LoadIpLocationAndSetProvinceSyncCanActivateService],
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadComponent: () => import('./pages/student-reverification-flow/student-reverification-flow.component').then((c) => c.StudentReverificationFlowComponent),
            },
        ],
    },
];
