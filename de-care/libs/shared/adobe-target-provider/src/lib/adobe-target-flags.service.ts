import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { defer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdobeTarget } from './models';

@Injectable({ providedIn: 'root' })
export class AdobeTargetFlagsService {
    private readonly _window: Window;
    private _adobeTarget: AdobeTarget;

    private get _target(): AdobeTarget {
        if (!this._adobeTarget) {
            if (!this._window?.['adobe'].target) {
                throw new Error('Adobe Target object not found on the window object!');
            }
            this._adobeTarget = this._window?.['adobe'].target;
        }
        return this._adobeTarget;
    }

    constructor(@Inject(DOCUMENT) private readonly document: Document) {
        this._window = document?.defaultView;
    }

    buildGetFlagsQuery(flagNames: string[]): Observable<{ [key: string]: any }> {
        return defer(() =>
            this._target.getOffers({
                request: {
                    execute: {
                        mboxes: flagNames.map((name, index) => ({ index, name }))
                    }
                }
            })
        ).pipe(
            map(response =>
                response.execute.mboxes
                    ?.map(mbox => {
                        return {
                            flagKey: mbox.name,
                            value: mbox.options?.[0]?.content
                        };
                    })
                    .reduce((final, i) => {
                        final[i.flagKey] = i.value;
                        return final;
                    }, {})
            )
        );
    }

    applyFlags(flagNames: string[]): void {
        this._target.applyOffers({
            response: {
                execute: {
                    mboxes: flagNames.map((name, index) => ({ index, name }))
                }
            }
        });
    }
}
