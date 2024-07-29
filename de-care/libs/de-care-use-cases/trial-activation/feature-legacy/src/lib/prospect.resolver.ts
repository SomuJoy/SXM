import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { ProspectModel, ServerResponseProspectModel } from '@de-care/data-services';
import { catchError, concatMap, map } from 'rxjs/operators';
import { TrialTokenResolver } from './trial-token.resolver';
import { ProgramCodeResolver } from './program-code.resolver';

export interface ProspectInfo {
    prospectData: ProspectModel;
    offer: any;
}

@Injectable()
export class ProspectResolver implements Resolve<Observable<ProspectInfo>> {
    constructor(private _trialTokenResolver: TrialTokenResolver, private _programCodeResolver: ProgramCodeResolver) {}

    formatProspectDataForActivation(customerInfo: ServerResponseProspectModel) {
        if (!customerInfo) {
            return null;
        }

        const formattedProspectInfo: ProspectModel = {
            firstName: customerInfo.firstname,
            lastName: customerInfo.lastname,
            username: customerInfo.username || null,
            trialstartdate: customerInfo.trialstartdate || null,
            trialenddate: customerInfo.trialenddate || null,
            promocode: customerInfo.promocode || null
        };

        return formattedProspectInfo;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProspectInfo> {
        return this._programCodeResolver.resolve(route).pipe(
            concatMap(offer => {
                return this._trialTokenResolver.resolve(route, state).pipe(
                    map(prospectData => {
                        return { prospectData: this.formatProspectDataForActivation(prospectData), offer };
                    })
                );
            }),
            catchError(() => {
                return EMPTY;
            })
        );
    }
}
