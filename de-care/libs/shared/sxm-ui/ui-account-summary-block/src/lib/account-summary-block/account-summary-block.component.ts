import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-account-summary-block',
    templateUrl: './account-summary-block.component.html',
    styleUrls: ['./account-summary-block.component.scss'],
})
export class AccountSummaryBlockComponent implements OnInit, ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() accountData: any;
    @Input() srcData = '';
    @Output() verifyClicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() ctaClicked: EventEmitter<string> = new EventEmitter<string>();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        console.log('Multiple user page');
    }

    onVerifyClicked(account: any, accountType: string, subscription: any): void {
        account.accountType = accountType;
        account.selectedSubscriptionId = subscription?.id;
        this.verifyClicked.emit(account);
    }

    onRegisterClicked(): void {
        this.verifyClicked.emit();
    }

    onAppLogin(cta: string): void {
        this.ctaClicked.emit(cta);
    }
}
