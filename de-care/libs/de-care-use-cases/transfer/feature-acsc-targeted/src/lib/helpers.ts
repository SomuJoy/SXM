import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

interface LineItem {
    label: string;
    amount: string;
    tooltip?: string;
}
interface CurrentCharges {
    totalTaxesAndFeesAmount: string;
    totalDue: string;
    fees: LineItem[];
    taxes: LineItem[];
    previousBalance: LineItem;
    creditRemainingOnAccount: LineItem;
}
export interface QuoteData {
    currentCharges: CurrentCharges;
}

export const getDaysRemaining = (endDate: Date) => {
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const dateFrom = new Date();
    const start = Date.UTC(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
    const end = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return (end - start) / ONE_DAY;
};

export function isAdvantagePlan(planCode: string | undefined) {
    if (!planCode) {
        return false;
    }
    return planCode.includes('Advantage');
}

export function mapQuoteData(currentCharges, quoteText, currencyPipe: CurrencyPipe, currentLang): QuoteData {
    return {
        currentCharges: {
            totalTaxesAndFeesAmount: currencyPipe.transform(currentCharges.totalTaxesAndFeesAmount, 'USD', 'symbol-narrow', undefined, currentLang),
            totalDue: currencyPipe.transform(currentCharges.totalDue > 0 ? currentCharges.totalDue : 0, 'USD', 'symbol-narrow', undefined, currentLang),
            fees: currentCharges?.fees?.map((fee) => ({
                label: getFeesAndTaxesLabel(quoteText?.['TAXES_AND_FEES'], fee.description),
                amount: currencyPipe.transform(fee.amount, 'USD', 'symbol-narrow', undefined, currentLang),
            })),
            taxes: currentCharges?.taxes?.map((tax) => ({
                label: getFeesAndTaxesLabel(quoteText?.['TAXES_AND_FEES'], tax.description),
                amount: currencyPipe.transform(tax.amount, 'USD', 'symbol-narrow', undefined, currentLang),
            })),
            previousBalance: currentCharges?.previousBalance
                ? {
                      label: currentCharges?.previousBalance > 0 ? quoteText?.['PREVIOUS_BALANCE']?.['LABEL'] : quoteText?.['PREVIOUS_CREDIT'],
                      amount: currencyPipe.transform(Math.abs(currentCharges.previousBalance), 'USD', 'symbol-narrow', undefined, currentLang),
                      tooltip: currentCharges?.previousBalance > 0 ? quoteText?.['PREVIOUS_BALANCE']?.['TOOLTIP'] : null,
                  }
                : null,
            creditRemainingOnAccount: currentCharges?.creditRemainingOnAccount
                ? {
                      label: quoteText?.['CREDIT_REMAINING_ON_ACCOUNT'],
                      amount: currencyPipe.transform(Math.abs(currentCharges.creditRemainingOnAccount), 'USD', 'symbol-narrow', undefined, currentLang),
                      tooltip: null,
                  }
                : null,
        },
    };
}
export function mapQuoteDataForSP(
    quoteData,
    translateText,
    currencyPipe: CurrencyPipe,
    translateService: TranslateService,
    i18nPluralPipe: I18nPluralPipe,
    translateKeyPrefix: string
) {
    const termLengthPluralMap = translateText?.['TERM_MAP'];
    return {
        title: {
            label: translateText?.['CURRENT_LABEL'],
            amount: currencyPipe.transform(quoteData?.currentCharges.totalDue, 'USD', 'symbol-narrow', '1.0', translateService.currentLang),
        },
        quoteBlocks: [
            ...(quoteData?.futureCharges
                ? [
                      {
                          outerLine: {
                              label:
                                  (quoteData.futureCharges.isProrated ? translateText?.['FUTURE_DUE_LABEL_PRORATED'] : translateText?.['FUTURE_DUE_LABEL']) +
                                  quoteData.futureCharges.startDate,
                              amount: currencyPipe.transform(quoteData.futureCharges.totalDueOnStartDate, 'USD', 'symbol-narrow', undefined, translateService.currentLang),
                              ...(quoteData.futureCharges.isProrated && { tooltip: translateText?.['PRORATED_TOOLTIP'] }),
                          },
                          innerLines: [
                              {
                                  label:
                                      quoteData.futureCharges.planName +
                                      (quoteData.futureCharges.isPromo ? `, ${translateText?.['PROMOTION']}` : '') +
                                      (quoteData.futureCharges.isProrated ? `, ${translateText?.['PRORATED']}` : ''),
                                  amount: currencyPipe.transform(quoteData.futureCharges.planPricePerTerm, 'USD', 'symbol-narrow', undefined, translateService.currentLang),
                              },
                              ...quoteData.futureCharges.fees?.map((fee) => ({
                                  label: getFeesAndTaxesLabel(translateText?.['FEES_AND_TAXES_DESCRIPTIONS'], fee.description),
                                  amount: currencyPipe.transform(fee.amount, 'USD', 'symbol-narrow', undefined, translateService.currentLang),
                              })),

                              ...quoteData.futureCharges.taxes?.map((tax) => ({
                                  label: getFeesAndTaxesLabel(translateText?.['FEES_AND_TAXES_DESCRIPTIONS'], tax.description),
                                  amount: currencyPipe.transform(tax.amount, 'USD', 'symbol-narrow', undefined, translateService.currentLang),
                              })),
                          ],
                      },
                  ]
                : []),
            ...(quoteData?.promoRenewalCharges
                ? [
                      {
                          outerLine: {
                              label: translateService.instant(`${translateKeyPrefix}QUOTE_SUMMARY.RENEWAL_DUE_LABEL`, {
                                  term: i18nPluralPipe.transform(quoteData.promoRenewalCharges.planTermLength, termLengthPluralMap),
                                  date: quoteData.promoRenewalCharges.startDate,
                              }),
                              amount: currencyPipe.transform(
                                  quoteData.promoRenewalCharges.totalDueOnStartDate,
                                  'USD',
                                  'symbol-narrow',
                                  undefined,
                                  translateService.currentLang
                              ),
                          },
                          innerLines: [
                              {
                                  label: `${quoteData.promoRenewalCharges.planName}, ${translateText?.['PROMOTION']}`,
                                  amount: currencyPipe.transform(
                                      quoteData.promoRenewalCharges.planPricePerTerm,
                                      'USD',
                                      'symbol-narrow',
                                      undefined,
                                      translateService.currentLang
                                  ),
                              },
                              ...quoteData.promoRenewalCharges.fees?.map((fee) => ({
                                  label: getFeesAndTaxesLabel(translateText?.['FEES_AND_TAXES_DESCRIPTIONS'], fee.description),
                                  amount: currencyPipe.transform(fee.amount, 'USD', 'symbol-narrow', undefined, translateService.currentLang),
                              })),
                              ...quoteData.promoRenewalCharges.taxes?.map((tax) => ({
                                  label: getFeesAndTaxesLabel(translateText?.['FEES_AND_TAXES_DESCRIPTIONS'], tax.description),
                                  amount: currencyPipe.transform(tax.amount, 'USD', 'symbol-narrow', undefined, translateService.currentLang),
                              })),
                          ],
                      },
                  ]
                : []),
            ...(quoteData?.renewalCharges
                ? [
                      {
                          outerLine: {
                              label: translateService.instant(`${translateKeyPrefix}QUOTE_SUMMARY.RENEWAL_DUE_LABEL`, {
                                  term: i18nPluralPipe.transform(quoteData.renewalCharges.planTermLength, termLengthPluralMap),
                                  date: quoteData.renewalCharges.startDate,
                              }),
                              amount: currencyPipe.transform(quoteData.renewalCharges.totalDueOnStartDate, 'USD', 'symbol-narrow', undefined, translateService.currentLang),
                          },
                          innerLines: [
                              {
                                  label: quoteData.renewalCharges.planName,
                                  amount: currencyPipe.transform(quoteData.renewalCharges.planPricePerTerm, 'USD', 'symbol-narrow', undefined, translateService.currentLang),
                              },
                              ...quoteData.renewalCharges.fees?.map((fee) => ({
                                  label: getFeesAndTaxesLabel(translateText?.['FEES_AND_TAXES_DESCRIPTIONS'], fee.description),
                                  amount: currencyPipe.transform(fee.amount, 'USD', 'symbol-narrow', undefined, translateService.currentLang),
                              })),
                              ...quoteData.renewalCharges.taxes?.map((tax) => ({
                                  label: getFeesAndTaxesLabel(translateText?.['FEES_AND_TAXES_DESCRIPTIONS'], tax.description),
                                  amount: currencyPipe.transform(tax.amount, 'USD', 'symbol-narrow', undefined, translateService.currentLang),
                              })),
                          ],
                      },
                  ]
                : []),
        ],
    };
}

function getFeesAndTaxesLabel(descriptionText, name: string) {
    return descriptionText?.[name.replace(/ /g, '_')?.toUpperCase()] ? descriptionText[name.replace(/ /g, '_').toUpperCase()] : name.replace(/_/g, ' ');
}
