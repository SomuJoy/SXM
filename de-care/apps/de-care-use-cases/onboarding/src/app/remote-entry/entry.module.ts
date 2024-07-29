import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                loadChildren: () =>
                    import('@de-care/de-care-use-cases/streaming/feature-setup-credentials').then((m) => m.DeCareUseCasesStreamingFeatureSetupCredentialsModule),
            },
        ]),
    ],
})
export class RemoteEntryModule {}
