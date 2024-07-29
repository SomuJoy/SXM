import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input } from '@angular/core';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { ComponentLocale, ComponentWithLocale, LanguageResources, LANGUAGE_CODES, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-balance-info',
    templateUrl: './balance-info.component.html',
    styleUrls: ['./balance-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiBalanceInfoComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    currentLang$ = this.translationsForComponentService.currentLang$;
    dateFormat$: Observable<string>;

    @Input() canSelectPaymentFrequency = false;

    @Input() balanceDataValues: {
        currentBalanceDue: number;
        nextPaymentAmount: number;
        nextPaymentDueDate: string;
        totalAmountDue: number;
        reactivationAmount: number;
        royaltyFee: number;
        remainingServiceBalanceFee: number;
        stateTax: number;
    };
    @Input() withoutFees = false;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
        this.dateFormat$ = this.currentLang$.pipe(
            map((language) => {
                switch (language) {
                    case LANGUAGE_CODES.EN_CA:
                        return 'MMMM d, y';
                    case LANGUAGE_CODES.EN_US:
                        return 'MM/dd/y';
                    case LANGUAGE_CODES.FR_CA:
                        return 'd MMMM y';
                    default:
                        return 'MM/dd/y';
                }
            })
        );
    }
}

@NgModule({
    declarations: [SxmUiBalanceInfoComponent],
    exports: [SxmUiBalanceInfoComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiAccordionChevronModule, SharedSxmUiUiTooltipModule],
})
export class SharedSxmUiBalanceInfoComponentModule {}
