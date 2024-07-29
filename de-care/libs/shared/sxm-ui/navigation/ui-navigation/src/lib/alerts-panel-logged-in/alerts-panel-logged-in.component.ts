import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output, Pipe, PipeTransform } from '@angular/core';
import {
    SxmUiAccountAlertWithLinkCriticalIconModule,
    SxmUiAccountAlertWithLinkNoIconModule,
    SxmUiAccountAlertWithLinkTagIconModule,
    SxmUiAccountAlertWithLinkWarningIconModule,
    SxmUiAccountAlertWithNoLinkCheckmarkIconModule,
} from '@de-care/shared/sxm-ui/alerts/ui-account-alerts';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiDatePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
type NextBestActionType = 'PAYMENT' | 'SC_AC' | 'PAYMENT_REMINDER' | 'CONVERT' | 'CREDENTIALS' | 'CONTENT' | 'DEVICES' | 'UPGRADE' | 'REACTIVATE' | 'PRICE_MSG';

interface NextBestAction {
    type: NextBestActionType;
    subscriptionId: string;
    last4DigitsOfRadioId?: string;
    noOfDaysLeftInTrial?: number;
    endDate?: string;
    favoriteChannel?: string;
    hasActiveAudioSelfPayOrPromo?: boolean;
    hasActiveAudioTrialPlan?: boolean;
    subHasStreamingCredentials?: boolean;
    accountRegistered?: boolean;
}

export interface AlertsData {
    firstName: string;
    nextBillingPaymentDate?: string;
    convertTrialEndDate?: string;
    alerts?: NextBestAction[];
    identificationState?: string;
    priceChangeDate?: string;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-alerts-panel-logged-in',
    templateUrl: './alerts-panel-logged-in.component.html',
    styleUrls: ['./alerts-panel-logged-in.component.scss'],
})
export class SxmUiAlertsPanelLoggedInComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    @Output() alertLinkClicked = new EventEmitter<string>();
    @Output() closed = new EventEmitter();
    @Input() data: AlertsData;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _translateService: TranslateService) {
        translationsForComponentService.init(this);
    }
}

@Pipe({ name: 'copyContentTranslationKey' })
export class CopyContentTranslationKeyPipe implements PipeTransform {
    transform(alert: NextBestAction, args: { translateKeyPrefix?: string; nextBillingPaymentDate?: string }): string {
        if (args.nextBillingPaymentDate && alert.type === 'PAYMENT_REMINDER') {
            return args.translateKeyPrefix + '.' + alert.type + '.CONTENT_WITH_DUE_DATE';
        } else if (alert?.noOfDaysLeftInTrial && alert.type === 'CONVERT') {
            return args.translateKeyPrefix + '.' + alert.type + (alert?.noOfDaysLeftInTrial > 30 ? '.CONTENT' : '.CONTENT_WITH_DUE_DAYS');
        } else if (alert.type === 'CREDENTIALS') {
            let key = args.translateKeyPrefix + '.' + alert.type + '.CONTENT';
            if (!alert?.accountRegistered) {
                if (alert?.hasActiveAudioTrialPlan) {
                    key += '_TRIAL';
                } else if (alert?.hasActiveAudioSelfPayOrPromo) {
                    key += '_SELFPAY';
                }
            }
            return key;
        } else if (alert.type === 'CONTENT') {
            return args.translateKeyPrefix + '.' + alert.type + (alert?.favoriteChannel ? '.CONTENT' : '.CONTENT_WITHOUT_FAVORITE_CHANNEL');
        } else {
            return args.translateKeyPrefix + '.' + alert.type + '.CONTENT';
        }
    }
}

@Pipe({ name: 'linkLabelTranslationKey' })
export class LinkLabelTranslationKeyPipe implements PipeTransform {
    transform(alert: NextBestAction, args: { translateKeyPrefix?: string }): string {
        if (alert.type === 'CREDENTIALS') {
            let key = args.translateKeyPrefix + '.' + alert.type + '.LINK_LABEL';
            if (!alert?.accountRegistered) {
                if (alert?.hasActiveAudioTrialPlan) {
                    key += '_TRIAL';
                } else if (alert?.hasActiveAudioSelfPayOrPromo) {
                    key += '_SELFPAY';
                }
            }
            return key;
        } else if (alert.type === 'CONTENT') {
            return args.translateKeyPrefix + '.' + alert.type + (alert?.favoriteChannel ? '.LINK_LABEL' : '.LINK_LABEL_WITHOUT_FAVORITE_CHANNEL');
        } else {
            return args.translateKeyPrefix + '.' + alert.type + '.LINK_LABEL';
        }
    }
}

@Pipe({ name: 'linkNameTranslationKey' })
export class LinkNameTranslationKeyPipe implements PipeTransform {
    transform(alert: NextBestAction, args: { translateKeyPrefix?: string }): string {
        if (alert.type === 'CONVERT') {
            return args.translateKeyPrefix + '.' + alert.type + (alert?.noOfDaysLeftInTrial > 30 ? '.LINK_NAME' : '.LINK_NAME_WITH_DUE_DAYS');
        } else if (alert.type === 'CREDENTIALS') {
            let key = args.translateKeyPrefix + '.' + alert.type + '.LINK_NAME';
            if (!alert?.accountRegistered) {
                key += '_TRIAL_SELFPAY';
            }
            return key;
        } else {
            return args.translateKeyPrefix + '.' + alert.type + '.LINK_NAME';
        }
    }
}

@NgModule({
    declarations: [SxmUiAlertsPanelLoggedInComponent, CopyContentTranslationKeyPipe, LinkLabelTranslationKeyPipe, LinkNameTranslationKeyPipe],
    exports: [SxmUiAlertsPanelLoggedInComponent],
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        SxmUiAccountAlertWithNoLinkCheckmarkIconModule,
        SxmUiAccountAlertWithLinkCriticalIconModule,
        SxmUiAccountAlertWithLinkNoIconModule,
        SharedSxmUiUiDataClickTrackModule,
        SxmUiAccountAlertWithLinkWarningIconModule,
        SxmUiAccountAlertWithLinkTagIconModule,
        SharedSxmUiUiDatePipeModule,
    ],
})
export class SharedSxmUiAlertsPanelLoggedInModule {}
