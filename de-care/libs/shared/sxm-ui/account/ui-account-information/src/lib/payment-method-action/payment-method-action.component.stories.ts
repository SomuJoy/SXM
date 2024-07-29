import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiPaymentMethodActionComponent, SharedSxmUiPaymentMethodActionComponentModule } from './payment-method-action.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { action } from '@storybook/addon-actions';

type StoryType = SxmUiPaymentMethodActionComponent;
const creditCardData = {
    creditCard: 'VISA',
    lastFourDigits: 1234,
    expMonth: 3,
    expYear: 2025,
};
export default {
    title: 'Component Library/Account/PaymentMethodActionComponent',
    component: SxmUiPaymentMethodActionComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiPaymentMethodActionComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiPaymentMethodActionComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: { ...args, paymentMethod: { type: 'Invoice' }, onEditPaymentMethod: action('edit payment method') },
    template: `<sxm-ui-payment-method-action [paymentMethod]="paymentMethod" (editPaymentMethod)="onEditPaymentMethod()"></sxm-ui-payment-method-action>`,
});

export const CreditCard: Story<StoryType> = (args: StoryType) => ({
    props: { ...args, paymentMethod: { type: 'creditCard', ...creditCardData }, onEditPaymentMethod: action('edit payment method') },
    template: `<sxm-ui-payment-method-action [paymentMethod]="paymentMethod" (editPaymentMethod)="onEditPaymentMethod()"></sxm-ui-payment-method-action>`,
});
