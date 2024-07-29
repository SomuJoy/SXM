import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { map, delay, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getIneligibleErrorViewModel } from '@de-care/de-care-use-cases/checkout/state-common';

@Component({
    selector: 'ineligible-error-page',
    templateUrl: './ineligible-error-page.component.html',
    styleUrls: ['./ineligible-error-page.component.scss'],
})
export class IneligibleErrorPageComponent implements OnInit, AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureStreamingModule.IneligibleErrorPageComponent.';
    viewModel$ = this._store.select(getIneligibleErrorViewModel);
    errorCode$ = this.viewModel$.pipe(map(({ errorCode }) => errorCode));
    routeUseCase$ = this.viewModel$.pipe(map(({ routeSegments }) => routeSegments));
    programCode$ = this.viewModel$.pipe(map(({ programCode }) => programCode));

    constructor(private readonly _store: Store, private readonly _router: Router) {}

    ngOnInit(): void {
        combineLatest([this.routeUseCase$, this.errorCode$, this.programCode$])
            .pipe(delay(5000), take(1))
            .subscribe(([routeSegments, errorCode, programCode]) => {
                // TODO: this should get changed to use relativeTo: activatedRoute so we don't need the top level routing strings here
                return this._router.navigate(['subscribe', 'checkout', routeSegments[3]], { queryParams: { errorCode, programCode } });
            });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }
}
