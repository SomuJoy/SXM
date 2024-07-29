import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostBinding, Inject, OnDestroy, ViewEncapsulation, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, Subscription, Subject } from 'rxjs';
import { tap, takeUntil, map } from 'rxjs/operators';

const CLASS_STYLE = 'enable-show-password--show-hide-password-icon';

@Component({
    selector: 'input[appEnableShowPassword]',
    template: '',
    styleUrls: ['./enable-show-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EnableShowPasswordComponent implements OnInit, OnDestroy {
    readonly translateKeyPrefix = 'sharedSxmUiUiEnableShowPasswordModule.enableShowPasswordComponent';

    private _subToToggleShowPassword: Subscription;
    private readonly _destroy$ = new Subject<boolean>();

    constructor(
        private element: ElementRef<HTMLElement>,
        @Inject(DOCUMENT) private readonly _document: Document,
        private _cdr: ChangeDetectorRef,
        private readonly _translateService: TranslateService
    ) {
        this.setup();
    }

    @HostBinding('attr.type') _inputType: 'text' | 'password' = 'password';

    hidesvg = this._generateIconHtml('hide');
    showsvg = this._generateIconHtml('show');
    clazz = this._document && this._document.createAttribute('class');

    ngOnInit() {
        this._translateService.onLangChange.pipe(takeUntil(this._destroy$)).subscribe((lang) => {
            this.hidesvg = this._generateIconHtml('hide');
            this.showsvg = this._generateIconHtml('show');
            this.setup();
        });
    }

    private _generateIconHtml(type: 'hide' | 'show') {
        return `<span>${this._translateService.instant(
            this.translateKeyPrefix + '.' + type.toLocaleUpperCase()
        )}</span><svg class="icon icon-utility large"><use class="icon-password-${type}" xlink:href="#icon-password-${type}"></use></svg>`;
    }

    toggle(button: HTMLElement) {
        switch (this._inputType) {
            case 'password': {
                this._inputType = 'text';
                button.innerHTML = this.hidesvg;
                button.setAttribute('aria-label', this._translateService.instant(`${this.translateKeyPrefix}.ARIA_HIDE`));
                break;
            }
            case 'text':
            default: {
                this._inputType = 'password';
                button.innerHTML = this.showsvg;
                button.setAttribute('aria-label', this._translateService.instant(`${this.translateKeyPrefix}.ARIA_SHOW`));
                break;
            }
        }
        this.element.nativeElement.focus();
        this._cdr.markForCheck();
    }
    setup() {
        // Dynamically attach a button element close to our input parent
        if (this._document) {
            const parent = this.element.nativeElement.parentNode;
            const button = this._document.createElement('button');
            this.clazz.value = CLASS_STYLE;

            button.setAttribute('type', 'button');
            button.innerHTML = this._inputType === 'text' ? this.hidesvg : this.showsvg;
            const prevButton = parent.querySelector('button');
            if (prevButton) {
                parent.replaceChild(button, prevButton);
                prevButton.removeAttribute('class');
                this._subToToggleShowPassword.unsubscribe();
            } else {
                parent.appendChild(button);
            }

            button.attributes.setNamedItem(this.clazz);

            this._subToToggleShowPassword = fromEvent(button, 'click')
                .pipe(
                    tap((_) => {
                        this.toggle(button);
                    })
                )
                .subscribe();
        }
    }
    ngOnDestroy(): void {
        if (this._subToToggleShowPassword) {
            this._subToToggleShowPassword.unsubscribe();
        }
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }
}
