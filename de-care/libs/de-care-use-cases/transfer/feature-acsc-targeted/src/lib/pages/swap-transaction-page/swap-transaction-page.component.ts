import { Component, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import {
    getSwapTransactionViewModel,
    SubmitSwapTransactionWorkflowService,
    SubmitSwapTransactionWorkflowRequest,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'de-care-swap-transaction-page',
    templateUrl: './swap-transaction-page.component.html',
    styleUrls: ['./swap-transaction-page.component.scss'],
})
export class SwapTransactionPageComponent implements AfterViewInit {
    viewModel$ = this._store.select(getSwapTransactionViewModel);
    processing$ = new BehaviorSubject(false);

    constructor(
        private readonly _store: Store,
        private readonly _submitSwapTransactionWorkflowService: SubmitSwapTransactionWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute
    ) {}

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: '', componentKey: '' }));
    }

    onSubmit() {
        this.processing$.next(true);
        // TODO: collect payment info from UX (note we don't need this in feature state, we can just hand it directly to the service call)
        const data: SubmitSwapTransactionWorkflowRequest = {
            useCardOnFile: false,
            newCreditCardInfo: null,
        };
        this._submitSwapTransactionWorkflowService.build(data).subscribe({
            next: () => {
                this._router.navigate(['./thanks'], { relativeTo: this._activatedRoute }).then(() => {
                    this.processing$.next(false);
                });
            },
            error: (error) => {
                // TODO: show error message
                this.processing$.next(false);
            },
        });
    }
}
