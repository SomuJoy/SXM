import { object, withKnobs, boolean, text } from '@storybook/addon-knobs';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { VehicleWithSubscriptionInfoComponent } from './vehicle-with-subscription-info.component';
import { SharedSxmUiUiVehicleWithSubscriptionInfoModule } from '../shared-sxm-ui-ui-vehicle-with-subscription-info.module';
import { TRANSLATE_PROVIDERS, MOCK_ALL_PACKAGE_DESC, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { DataOfferService } from '@de-care/data-services';
import { of } from 'rxjs';
import { SettingsService } from '@de-care/settings';

export const stories = storiesOf('Component Library/ui/vehicle-with-subscription-info', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiVehicleWithSubscriptionInfoModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                { provide: SettingsService, useValue: { isCanadaMode: false } },
                { provide: DataOfferService, useValue: { ...MOCK_ALL_PACKAGE_DESC, customer: () => of({}) } }
            ]
        })
    )
    .addDecorator(withTranslation);

const vehicle = {
    model: 'Elantra',
    year: 2021,
    make: 'Hyundai'
};

const data = {
    vehicle,
    radioId: '**43A4',
    planType: 'SELF_PAY',
    packageName: 'SXM_SIR_AUD_ALLACCESS',
    endDate: '2022-04-26T00:00:00-04:00',
    username: 'usd-w8291',
    isTrialRadio: true,
    isSelfPay: false,
    showIcon: true
};

stories.add(`New Car`, () => ({
    component: VehicleWithSubscriptionInfoComponent,
    props: {
        data: object('@Input() data', {
            ...data
        }),
        displayPackageNameAsTitle: boolean('@Input() displayPackageNameAsTitle', false),
        eyebrow: text('@Input() eyebrow', 'New Car')
    }
}));

stories.add(`New Radio`, () => ({
    component: VehicleWithSubscriptionInfoComponent,
    props: {
        data: object('@Input() data', {
            ...data,
            vehicle: { model: null, make: null, year: null }
        }),
        displayPackageNameAsTitle: boolean('@Input() displayPackageNameAsTitle', false),
        eyebrow: text('@Input() eyebrow', 'New Car')
    }
}));

stories.add(`New Subscription`, () => ({
    component: VehicleWithSubscriptionInfoComponent,
    props: {
        data: object('@Input() data', {
            vehicle,
            packageName: 'SXM_SIR_AUD_ALLACCESS',
            planType: 'SELF_PAY',
            startDate: '2022-04-26T00:00:00-04:00',
            isTrialRadio: false,
            isSelfPay: false,
            showIcon: false
        }),
        displayPackageNameAsTitle: boolean('@Input() displayPackageNameAsTitle', true),
        eyebrow: text('@Input() eyebrow', 'Subscription')
    }
}));

stories.add(`Transfer from`, () => ({
    component: VehicleWithSubscriptionInfoComponent,
    props: {
        data: object('@Input() data', {
            vehicle: { model: 'Golf', year: 2015, make: 'Volkswagen' },
            packageName: 'SXM_SIR_AUD_ALLACCESS',
            planType: 'SELF_PAY',
            endDate: '2022-04-26T00:00:00-04:00',
            isTrialRadio: false,
            isSelfPay: false,
            showIcon: false
        }),
        displayPackageNameAsTitle: boolean('@Input() displayPackageNameAsTitle', false),
        eyebrow: text('@Input() eyebrow', 'Transfer service from'),
        footer: 'This car will be removed from your account.'
    }
}));
