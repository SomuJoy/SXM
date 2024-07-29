import { Component, OnInit } from '@angular/core';
import { SettingsService } from '@de-care/settings';

@Component({
    selector: 'sxm-ui-app-footer',
    templateUrl: './app-footer.component.html',
    styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent implements OnInit {
    isCanada: boolean;
    date = new Date();
    currentYear = this.date.getFullYear();

    constructor(private _settingsService: SettingsService) {
        this.isCanada = this._settingsService.isCanadaMode;
    }

    ngOnInit() {}
}
