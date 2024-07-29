import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LoadAddRadioRouterDataWorkflowService, LoadAddRadioRouterDataWorkflowServiceResult } from '@de-care/de-care-use-cases/checkout/state-add-radio-router';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { SharedSxmUiUiLoadingOverlayModule } from '@de-care/shared/sxm-ui/ui-loading-overlay';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-messages-page',
    templateUrl: './messages-page.component.html',
    styleUrls: ['./messages-page.component.scss'],
    standalone: true,
    imports: [CommonModule, TranslateModule, SharedSxmUiUiLoadingOverlayModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesPageComponent implements ComponentWithLocale, OnInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    showFullViewLoader$ = new BehaviorSubject(false);

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _router: Router,
        private readonly _loadAddRadioRouterDataWorkflowService: LoadAddRadioRouterDataWorkflowService
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit() {
        this.showFullViewLoader$.next(true);
        this._loadAddRadioRouterDataWorkflowService
            .build()
            .pipe(
                tap((result: LoadAddRadioRouterDataWorkflowServiceResult) => {
                    if (result === 'DEVICES_AVAILABLE') {
                        this._router.navigate(['/subscribe/checkout/purchase/satellite/add-radio-router/device-select']);
                    } else {
                        this._router.navigate(['/subscribe/checkout/purchase/satellite/add-radio-router/device-lookup']);
                    }
                }),
                catchError(() => of(this._router.createUrlTree(['/error'])))
            )
            .subscribe();
    }
}
