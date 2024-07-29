import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { SharedDocumentEventService } from '@de-care/browser-common';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v4';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-tooltip',
    templateUrl: './tool-tip.component.html',
    styleUrls: ['./tool-tip.component.scss'],
})
export class SxmUiToolTipComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() opened = false;
    @Input() ariaLabel: string;
    @ViewChild('tooltip', { static: true }) tooltip: ElementRef;
    @ViewChild('tooltipContent', { static: true }) tooltipContent: ElementRef;
    clickSubscription: Subscription;
    tooltipAriaDescribedById = uuid();
    private unsubscribe$ = new Subject<void>();
    private readonly _window: Window;

    constructor(
        private readonly docEvents: SharedDocumentEventService,
        @Inject(DOCUMENT) readonly document: Document,
        private readonly translationsForComponentService: TranslationsForComponentService
    ) {
        translationsForComponentService.init(this);
        this._window = document?.defaultView;
    }

    toggle() {
        if (this.opened) {
            this._handleDeselect();
        } else {
            this._handleSelect();
        }
    }

    close() {
        if (this.opened) {
            this._handleDeselect();
        }
    }

    private _handleSelect(): void {
        this._fixContentPosition();
        this.opened = true;
        if (this.clickSubscription === undefined || this.clickSubscription.closed) {
            this.clickSubscription = this.docEvents
                .clickAway(this.tooltip)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(() => this._handleDeselect());
        }
    }

    private _handleDeselect(): void {
        this.opened = false;
        this.unsubscribe$.next();
        const element = this.tooltipContent.nativeElement;
        // clean the stylings for fixing the position
        element.style.left = '';
    }

    private _fixContentPosition() {
        if (this._window) {
            const element = this.tooltipContent.nativeElement;
            const rects = element.getBoundingClientRect();
            if (rects.left < 0) {
                element.style.left = `${rects.left - element.offsetLeft}px`;
                return;
            }
            const windowWith = this._window.innerWidth;
            if (rects.right > windowWith) {
                const offsetRight = rects.right - windowWith;
                let calculatedMoveToLeft = rects.left + element.offsetLeft - offsetRight - 92;
                calculatedMoveToLeft = calculatedMoveToLeft > 0 ? -calculatedMoveToLeft : calculatedMoveToLeft;
                element.style.left = `${calculatedMoveToLeft}px`;
                return;
            }
        }
    }
}
