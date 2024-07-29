import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChannelDiscoveryStateChannelSuggestionFilterModule } from '@de-care/channel-discovery/state-channel-suggestion-filter';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                loadComponent: () => import('./shell/shell.component').then((c) => c.ShellComponent),
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'select-categories',
                    },
                    {
                        path: 'select-categories',
                        loadComponent: () => import('./pages/step-select-category-page/step-select-category-page.component').then((c) => c.StepSelectCategoryPageComponent),
                    },
                ],
            },
        ]),
        ChannelDiscoveryStateChannelSuggestionFilterModule,
    ],
})
export class ChannelDiscoveryFeatureChannelSuggestionFilterModule {}
