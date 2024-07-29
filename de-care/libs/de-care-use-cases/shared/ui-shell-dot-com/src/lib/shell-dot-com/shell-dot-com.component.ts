import { Component, OnDestroy, OnInit, Inject, ViewContainerRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { userSetLanguage, provinceChanged, getSelectedProvince, getProvinceList } from '@de-care/domains/customer/state-locale';
import { select, Store } from '@ngrx/store';
import { DOCUMENT } from '@angular/common';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v4';
import { DotComShellConfig, DOT_COM_SHELL_CONFIG } from '../dot-com-shell-config-token';
//import { ShellComponentTheming } from '../shell-component-theming.interface';
export interface ShellDotComRouteConfiguration {
    isSimple: boolean;
}

@Component({
    selector: 'de-care-shell-dot-com',
    templateUrl: './shell-dot-com.component.html',
    styleUrls: ['./shell-dot-com.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ShellDotComComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly _headerLoaded$ = new Subject<boolean>();
    private readonly _footerLoaded$ = new Subject<boolean>();
    private _destroy$ = new Subject<boolean>();

    translationKeyPrefix = 'DeCareUseCasesSharedUiShellDotComModule.ShellDotComComponent';
    selectedProvince$ = this._store.pipe(select(getSelectedProvince));
    provinces$ = this._store.pipe(select(getProvinceList));
    isSimple = false;
    uniqueId: string = uuid();

    // jqueryUrl: string;
    // sxmNavJavascriptUrl: string;
    // sxmNavCssUrl: string;
    sxmNavWidgetJavascriptUrl: string;
    sxmNavWidgetDomain: string;
    sxmNavWidgetEnvironment: string;

    domIds = [];

    constructor(
        private readonly _store: Store,
        private readonly _route: ActivatedRoute,
        private _viewContainerRef: ViewContainerRef,
        @Inject(DOT_COM_SHELL_CONFIG) dotComConfig: DotComShellConfig,
        @Inject(DOCUMENT) private _document: Document
    ) {
        if (!dotComConfig) return;
        // this.sxmNavJavascriptUrl = `${dotComConfig.assetDomain}${dotComConfig.sxmNavJavascriptPath}`;
        // this.sxmNavCssUrl = `${dotComConfig.assetDomain}${dotComConfig.sxmNavCssPath}`;
        // if (dotComConfig.importJquery) this.jqueryUrl = 'https://code.jquery.com/jquery-3.5.1.min.js';
        this.sxmNavWidgetJavascriptUrl = `${dotComConfig.assetDomain}${dotComConfig.sxmNavWidgetJavascriptPath}`;
        this.sxmNavWidgetDomain = dotComConfig.assetDomain;
        this.sxmNavWidgetEnvironment = dotComConfig.sxmNavWidgetEnvironment;

        this.isSimple = this._route.snapshot.data?.shellDotCom?.isSimple;
    }

    ngOnInit(): void {
        //this.theming = this._route.snapshot.data?.theming;
        // this.loadSXMNavCss();
        // this.loadJquery();
        this.loadSxmNavWidgetJavascript();
    }

    ngAfterViewInit(): void {
        combineLatest([this._headerLoaded$, this._footerLoaded$])
            .pipe(
                takeUntil(this._destroy$),
                map(([headerLoaded, footerLoaded]) => headerLoaded && footerLoaded)
            )
            .subscribe((/*loaded*/) => {
                // if (loaded) this.loadSXMNavJavascript();
            });
    }

    // loadSXMNavCss() {
    //     if (!this.sxmNavCssUrl) return;
    //     const linkEl = this._document.createElement('LINK') as HTMLLinkElement;
    //     linkEl.id = this.getDomId('style-link');
    //     linkEl.rel = 'stylesheet';
    //     linkEl.type = 'text/css';
    //     linkEl.href = this.sxmNavCssUrl;
    //     this._document.head.appendChild(linkEl);
    //     this.domIds.push(linkEl.id);
    // }

    loadSxmNavWidgetJavascript() {
        if (!this.sxmNavWidgetJavascriptUrl) return;
        const scriptEl = this._document.createElement('SCRIPT') as HTMLScriptElement;
        scriptEl.src = this.sxmNavWidgetJavascriptUrl;

        scriptEl.id = this.getDomId('script-nav-widget');

        if (this.sxmNavWidgetDomain) scriptEl.setAttribute('data-domain', this.sxmNavWidgetDomain);
        if (this.sxmNavWidgetEnvironment) scriptEl.setAttribute('data-environment', this.sxmNavWidgetEnvironment);

        scriptEl.async = true;
        scriptEl.defer = true;

        this._document.body.appendChild(scriptEl);
        this.domIds.push(scriptEl.id);
    }

    // loadJquery() {
    //     if (!this.jqueryUrl) return;
    //     const scriptEl = this._document.createElement('SCRIPT') as HTMLScriptElement;
    //     scriptEl.src = this.jqueryUrl;

    //     scriptEl.id = this.getDomId('script-jquery');
    //     scriptEl.async = true;
    //     scriptEl.defer = true;

    //     this._document.body.appendChild(scriptEl);
    //     this.domIds.push(scriptEl.id);
    // }

    // loadSXMNavJavascript() {
    //     if (!this.sxmNavJavascriptUrl) return;
    //     const scriptEl = this._document.createElement('SCRIPT') as HTMLScriptElement;
    //     scriptEl.src = this.sxmNavJavascriptUrl;

    //     scriptEl.id = this.getDomId('script');
    //     scriptEl.async = true;
    //     scriptEl.defer = true;

    //     this._document.body.appendChild(scriptEl);
    //     this.domIds.push(scriptEl.id);
    // }

    removeSXMNavCssAndJavascript() {
        this.domIds.forEach((id) => {
            const el = this._document.getElementById(id);
            if (el) el.remove();
        });
    }

    switchLanguage(lang: string) {
        this._store.dispatch(userSetLanguage({ lang }));
    }

    onUserChangedProvince(province: string) {
        this._store.dispatch(provinceChanged({ province }));
    }

    onHeaderLoaded() {
        this._headerLoaded$.next(true);
    }

    onFooterLoaded() {
        this._footerLoaded$.next(true);
    }

    private getDomId(type) {
        return `${type}-${this.uniqueId}`;
    }

    ngOnDestroy() {
        this.removeSXMNavCssAndJavascript();

        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }
}
