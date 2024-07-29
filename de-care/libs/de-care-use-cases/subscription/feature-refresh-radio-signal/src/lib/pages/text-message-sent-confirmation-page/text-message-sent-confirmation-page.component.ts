import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getPhoneNumber, getReceiverId, TextInstructionsWorkflowService } from '@de-care/de-care-use-cases/subscription/state-refresh-radio-signal';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-text-message-sent-confirmation-page',
    templateUrl: './text-message-sent-confirmation-page.component.html',
    styleUrls: ['./text-message-sent-confirmation-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageSentConfirmationPageComponent implements ComponentWithLocale, OnInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    private unsubscribe$: Subject<void> = new Subject();
    loadingInstructions$ = new BehaviorSubject<boolean>(false);
    receiverId: any;
    phoneNumber: any;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private _store: Store,
        private _textInstructionsWorkflowService: TextInstructionsWorkflowService,
        private readonly _translateService: TranslateService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        console.log('Text confirmation page');
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    sendRefreshSignalInstructions() {
        this.loadingInstructions$.next(true);
        const languagePreference = this._normalizeLangToLocale(this._translateService.currentLang);
        this._store.select(getReceiverId).subscribe((data) => {
            this.receiverId = data;
        });
        this._store.select(getPhoneNumber).subscribe((data) => {
            this.phoneNumber = data;
        });
        const phone = this.phoneNumber;
        this._textInstructionsWorkflowService
            .build({ phone, radioId: this.receiverId, languagePreference })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (response) => {
                    if (response) {
                        this.loadingInstructions$.next(false);
                        return this._navigateTo('../text-message-sent-confirmation');
                    } else {
                        this.loadingInstructions$.next(false);
                    }
                },
                (_) => this._handleTextServiceError()
            );
    }

    private _normalizeLangToLocale(locale: string): string {
        return locale?.replace('-', '_');
    }

    private _handleTextServiceError() {
        this.loadingInstructions$.next(false);
    }

    private _navigateTo(destination: string): void {
        this._router.navigate([destination], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }
}
