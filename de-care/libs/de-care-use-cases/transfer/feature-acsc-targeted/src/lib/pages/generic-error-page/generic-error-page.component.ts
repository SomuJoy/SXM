import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { Subject } from 'rxjs';
import { SxmLanguages } from '@de-care/shared/translation';
import { takeUntil, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';

@Component({
    selector: 'de-care-generic-error-page',
    templateUrl: './generic-error-page.component.html',
    styleUrls: ['./generic-error-page.component.scss']
})
export class GenericErrorPageComponent implements OnInit, OnDestroy {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.GenericErrorComponent.';
    private readonly destroy$ = new Subject<boolean>();
    currentLang: SxmLanguages;
    isChatAvailable = true;
    constructor(private readonly _store: Store, private readonly _translateService: TranslateService) {}

    ngOnInit() {
        this._translateService.onLangChange
            .pipe(
                takeUntil(this.destroy$),
                map(lang => lang.lang)
            )
            .subscribe(lang => {
                this.currentLang = lang as SxmLanguages;
                this.isChatAvailable = this.currentLang !== 'fr-CA';
            });
        this.isChatAvailable = this._translateService.currentLang !== 'fr-CA';
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'scac', componentKey: 'errorother' }));
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
