import { Component, ChangeDetectionStrategy, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { getContactPreferencesDetails, GetContactPreferencesUrlWorkflowService } from '@de-care/de-care-use-cases/account/state-my-account-account-info';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { skip, switchMap, takeUntil, tap } from 'rxjs/operators';

interface ContactPreferences {
    encryptedXmlPayload: string;
    generatedUrl: string;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-contact-preferences-page',
    templateUrl: './contact-preferences-page.component.html',
    styleUrls: ['./contact-preferences-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPreferencesPageComponent implements ComponentWithLocale, OnInit, AfterViewInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    url: SafeResourceUrl;
    encryptedPayload: string;
    showIframe = false;
    private readonly _destroy$: Subject<boolean> = new Subject<boolean>();
    @ViewChild('contactPreferencesForm') private readonly _contactPreferencesForm;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private _sanitizer: DomSanitizer,
        private _store: Store,
        private readonly _getContactPreferencesUrlWorkflowService: GetContactPreferencesUrlWorkflowService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.translationsForComponentService.currentLang$
            .pipe(
                skip(1), // skipping the first response because the getContactPreferencesUrlWorkflowService has already been called by the canactivate
                takeUntil(this._destroy$),
                tap(() => (this.showIframe = false)),
                switchMap((currLang) => this._getContactPreferencesUrlWorkflowService.build({ langPref: currLang }))
            )
            .subscribe();
        this._store
            .pipe(
                takeUntil(this._destroy$),
                select(getContactPreferencesDetails),
                tap((contactPreferences: ContactPreferences) => {
                    this.url = this._setUrl(contactPreferences.generatedUrl);
                    this.encryptedPayload = contactPreferences.encryptedXmlPayload;
                    this._changeDetectorRef.detectChanges();
                    if (this.url && this.encryptedPayload) {
                        this._contactPreferencesForm?.nativeElement?.submit();
                    }
                })
            )
            .subscribe();
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'contactpref' }));
        // Only gets called once when the page loads.  The observable in the ngOnInit will handle subsequent calls
        if (this.url && this.encryptedPayload) {
            this._contactPreferencesForm.nativeElement.submit();
        }
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    iframeLoaded() {
        this.showIframe = true;
    }

    private _setUrl(url: string): SafeResourceUrl {
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
