import { ChangeDetectionStrategy, Component } from '@angular/core';
import { suspensify } from '@jscutlery/operators';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiPrimaryPackageCardModule, SxmUiPrimaryPackageCardSkeletonLoaderComponentModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { SxmUiSkeletonLoaderTextCopyComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import {
    getStudentVerificationViewModel,
    LoadStudentVerificationDataWorkflowService,
    LoadStudentVerificationDataWorkflowServiceError,
} from '@de-care/de-care-use-cases/checkout/state-student-verification';
import { SheerIdStudentVerificationComponent } from '../page-parts/sheer-id-student-verification/sheer-id-student-verification.component';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-student-verification-flow',
    templateUrl: './student-verification-flow.component.html',
    styleUrls: ['./student-verification-flow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        ReactiveComponentModule,
        SharedSxmUiUiAccordionChevronModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiUiDataClickTrackModule,
        DeCareSharedUiPageLayoutModule,
        SxmUiPrimaryPackageCardSkeletonLoaderComponentModule,
        SxmUiSkeletonLoaderTextCopyComponentModule,
        SheerIdStudentVerificationComponent,
    ],
})
export class StudentVerificationFlowComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private _store: Store,
        private readonly _loadStudentVerificationDataWorkflowService: LoadStudentVerificationDataWorkflowService,
        private readonly _router: Router
    ) {
        translationsForComponentService.init(this);
    }

    viewModel$ = this._store.select(getStudentVerificationViewModel);
    dataLoad$ = this._loadStudentVerificationDataWorkflowService.build().pipe(
        suspensify(),
        tap(({ error }: { error: LoadStudentVerificationDataWorkflowServiceError }) => {
            if (error) {
                switch (error) {
                    case 'REGULAR_CHECKOUT_FLOW_REQUIRED':
                        break;
                }
            }
        })
    );
}
