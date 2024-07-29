import { Routes } from '@angular/router';

export const APPLICATION_ROUTES: Routes = [
    {
        path: 'filter',
        loadChildren: () => import('@de-care/channel-discovery/feature-channel-suggestion-filter').then((m) => m.ChannelDiscoveryFeatureChannelSuggestionFilterModule),
    },
];
