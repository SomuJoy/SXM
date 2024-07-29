import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, NgModule } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getProgramAndMarketingPromoCodes, LoadFlepzDataSuccess } from '@de-care/purchase-state';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take, withLatestFrom, tap, filter, switchMap } from 'rxjs/operators';
import { checkoutIsLoading, LoadCheckoutFlepz, getIsStreaming, getCheckoutLeadOffer, checkoutCouldHideLoader, CheckoutStateModule } from '@de-care/checkout-state';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { TranslateService } from '@ngx-translate/core';
import { pageDataFinishedLoading, pageDataStartedLoading } from '@de-care/de-care/shared/state-loading';
import { SxmUiModule } from '@de-care/sxm-ui';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHeaderModule } from '@de-care/app-header';

@Component({
    selector: 'app-layout-main',
    templateUrl: './layout-main.component.html',
    styleUrls: ['./layout-main.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutMainComponent implements OnDestroy, OnInit {
    selectedProvince$: Observable<string>;
    logoLinkUrl = '';
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private _store: Store,
        private _userSettingsService: UserSettingsService,
        private _settingsService: SettingsService,
        private _translateService: TranslateService
    ) {}

    ngOnInit() {
        this._store
            .pipe(
                select(checkoutCouldHideLoader),
                takeUntil(this._destroy$),
                filter((couldHideLoader) => couldHideLoader)
            )
            .subscribe(() => this._store.dispatch(pageDataFinishedLoading()));

        this.selectedProvince$ = this._userSettingsService.selectedCanadianProvince$;

        this.logoLinkUrl = this._getLogoLinkUrl(this._translateService.currentLang);
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    switchLanguage(language: string): void {
        this._translateService.use(language);
        this.logoLinkUrl = this._getLogoLinkUrl(language);
    }

    private _getLogoLinkUrl(langKey: string) {
        return this._settingsService.isCanadaMode ? (langKey.substr(0, 2) === 'fr' ? 'https://www.siriusxm.ca/fr/' : 'https://siriusxm.ca/') : 'https://www.siriusxm.com/';
    }

    onUserChangedProvince(): void {
        // reload checkout flepz once province is changed (province change is only available on flepz)
        this._store.dispatch(pageDataStartedLoading());
        this._store
            .pipe(
                select(getProgramAndMarketingPromoCodes),
                withLatestFrom(this._store.pipe(select(getIsStreaming))),
                tap(([{ marketingPromoCode, programCode }, isStreaming]) => {
                    this._store.dispatch(LoadCheckoutFlepz({ payload: { marketingPromoCode, programId: programCode, ...(isStreaming && { isStreaming: true }) } }));
                }),
                switchMap(([{ programCode }]) =>
                    this._store.pipe(select(checkoutIsLoading)).pipe(
                        filter((isLoading) => {
                            return !isLoading;
                        }),
                        withLatestFrom(this._store.pipe(select(getCheckoutLeadOffer))),
                        tap(([, offer]) => {
                            this._store.dispatch(LoadFlepzDataSuccess({ payload: { account: null, programCode, offer } }));
                        })
                    )
                ),
                take(1)
            )
            .subscribe();
    }
}

@NgModule({
    imports: [CommonModule, RouterModule, SxmUiModule, AppHeaderModule, CheckoutStateModule],
    declarations: [LayoutMainComponent],
    exports: [LayoutMainComponent],
})
export class LayoutMainComponentModule {}
