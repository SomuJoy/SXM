import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadFindAccountExperienceService } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';

@Injectable({ providedIn: 'root' })
export class FindAccountPageCanActivateService implements CanActivate {
    constructor(private readonly _loadFindAccountExperienceService: LoadFindAccountExperienceService) {}

    canActivate(): Observable<boolean> {
        return this._loadFindAccountExperienceService.build();
    }
}
