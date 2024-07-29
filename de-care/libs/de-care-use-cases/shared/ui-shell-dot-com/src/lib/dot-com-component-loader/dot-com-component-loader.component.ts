import { Component, Input, AfterViewInit, Output, EventEmitter, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DotComShellConfig, DOT_COM_SHELL_CONFIG } from '../dot-com-shell-config-token';

@Component({
    selector: 'de-care-dot-com-component-loader',
    templateUrl: './dot-com-component-loader.component.html',
})
export class DotComComponentLoaderComponent implements AfterViewInit {
    @Input() type: 'FullNavigation' | 'FullFooter' = 'FullNavigation';
    @Output() loaded = new EventEmitter();
    navigationDomain: string;
    locale = 'en';
    html = '';

    constructor(private _http: HttpClient, @Inject(DOT_COM_SHELL_CONFIG) dotComConfig: DotComShellConfig) {
        if (!dotComConfig) return;

        this.navigationDomain = dotComConfig.navigationDomain;
        // this.locale = dotComConfig.lang;
    }

    ngAfterViewInit(): void {
        this.loadHTML();
    }

    loadHTML() {
        if (!this.navigationDomain) return;
        let url = `${this.navigationDomain}/sites/Satellite?pagename=sxm/Components/${this.type}&locale=${this.locale}&segments=sxm`;
        if (this.locale == 'ca') {
            if (this.type == 'FullNavigation') url = `${this.navigationDomain}/feed/pega-header/`;
            else url = `${this.navigationDomain}/feed/pega-footer/`;
        }
        if (this.locale == 'fr') {
            if (this.type == 'FullNavigation') url = `${this.navigationDomain}/fr/feed/pega-header/`;
            else url = `${this.navigationDomain}/fr/feed/pega-footer/`;
        }

        this._http.get(url, { responseType: 'text' }).subscribe(
            (html) => {
                this.html = html;
                this.loaded.emit();
            },
            () => {
                //
            }
        );
    }
}
