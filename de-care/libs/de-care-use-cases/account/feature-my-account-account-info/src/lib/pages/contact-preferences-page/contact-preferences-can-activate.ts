import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { GetContactPreferencesUrlWorkflowService } from '@de-care/de-care-use-cases/account/state-my-account-account-info';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class ContactPreferencesCanActivateService implements CanActivate {
    constructor(
        private readonly _router: Router,
        private readonly _getContactPreferencesUrlWorkflowService: GetContactPreferencesUrlWorkflowService,
        private readonly _translateService: TranslateService
    ) {}

    canActivate(): Observable<boolean | UrlTree> {
        const langPref = this._translateService.currentLang ? this._translateService.currentLang.split('-')[0] : undefined;
        return this._getContactPreferencesUrlWorkflowService.build({ langPref: langPref }).pipe(
            map((ready) => {
                return ready ? true : this._router.createUrlTree(['account/manage/account-info']);
            })
        );
    }
}
