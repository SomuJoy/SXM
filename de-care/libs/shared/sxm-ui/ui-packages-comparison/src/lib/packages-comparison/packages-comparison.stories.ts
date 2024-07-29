import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { withMockSettings, withTranslation, TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
import { DataOfferService } from '@de-care/data-services';
import { of } from 'rxjs';
import { SharedSxmUiUiPackagesComparisonModule } from '../shared-sxm-ui-ui-packages-comparison.module';
import { UserSettingsService } from '@de-care/settings';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';

const packages = [
    {
        packageName: 'SXM_SIR_EVT',
        basePrice: 16.99,
        pricePerMonth: 16.99,
        mrdEligible: true
    },
    {
        packageName: 'SXM_SIR_ALLACCESS_FF',
        basePrice: 21.99,
        pricePerMonth: 21.99,
        mrdEligible: true
    }
];

const packages2 = [
    {
        packageName: 'SXM_SIR_EVT',
        basePrice: 16.99,
        pricePerMonth: 4.99,
        mrdEligible: true
    },
    {
        packageName: 'SXM_SIR_AUD_PKG_MM',
        basePrice: 10.99,
        pricePerMonth: 10.99,
        mrdEligible: false
    }
];

const endDate: Date = new Date('2020-06-25');

const ALL_ACCESS = {
    name: 'SiriusXM All Access',
    packageName: 'SXM_SIR_ALLACCESS_FF',
    mrdEligible: true,
    channelLineUpURL: '',
    channels: [
        {
            features: [
                {
                    name: 'Ad-free music channels',
                    count: '240+'
                },
                {
                    name: 'Channels included',
                    count: '350+'
                },
                {
                    name: 'Howard Stern channels and video',
                    count: null
                },
                {
                    name: 'Listen outside the car',
                    count: null
                },
                {
                    name: 'SiriusXM video',
                    count: null
                },
                {
                    name: '24/7 news, talk, sports, and comedy',
                    count: null
                },
                {
                    name: 'Change or cancel at any time',
                    count: null
                },
                {
                    name: 'New! Personalized Stations Powered by Pandora<sup>&reg;',
                    count: null
                },
                {
                    name: 'NFL<sup>&reg;</sup> and NASCAR<sup>&reg;</sup> Play-by-play',
                    count: null
                },
                {
                    name: 'MLB<sup>&reg;</sup>, NBA<sup>&reg;</sup>, NHL<sup>&reg;</sup> and PGA<sup>&reg;</sup> Play-by-play',
                    count: null
                }
            ]
        }
    ]
};
const SELECT = {
    name: 'SiriusXM Select',
    packageName: 'SXM_SIR_EVT',
    channels: [
        {
            features: [
                {
                    name: 'Ad-free music channels',
                    count: '240+'
                },
                {
                    name: '24/7 news, talk and comedy',
                    count: null
                },
                {
                    name: 'Channels included',
                    count: '325+'
                },
                {
                    name: 'Listen outside the car',
                    count: null
                },
                {
                    name: 'SiriusXM video',
                    count: null
                },
                {
                    name: '24/7 news, talk, sports, and comedy',
                    count: null
                },
                {
                    name: 'Change or cancel at any time',
                    count: null
                }
            ]
        }
    ],
    mrdEligible: true,
    channelLineUpURL: ''
};
const MOSTLY_MUSIC = {
    name: 'SiriusXM Mostly Music',
    packageName: 'SXM_SIR_AUD_PKG_MM',
    channels: [
        {
            features: [
                {
                    name: 'Ad-free music channels',
                    count: '60+'
                },
                {
                    name: '24/7 news, talk and comedy',
                    count: null
                },
                {
                    name: 'Channels included',
                    count: '85+'
                },
                ,
                {
                    name: 'Change or cancel at any time',
                    count: null
                }
            ]
        }
    ],
    mrdEligible: false,
    channelLineUpURL: ''
};

const stories = storiesOf('Component Library/ui/packages-comparison', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiPackagesComparisonModule, SharedSxmUiUiModalModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                {
                    provide: UserSettingsService,
                    useValue: {
                        dateFormat$: of('MM/dd/yy')
                    }
                }
            ]
        })
    )
    .addDecorator(withMockSettings)
    .addDecorator(withTranslation);

stories.add('default', () => ({
    moduleMetadata: {
        providers: [
            {
                provide: DataOfferService,
                useValue: {
                    allPackageDescriptions: ({ locale }) => {
                        return of([SELECT, ALL_ACCESS]);
                    }
                }
            }
        ]
    },
    template: `
        <sxm-ui-packages-comparison
        [packages]="packages"
        [familyDiscount]="familyDiscount"
        [endDate]="endDate"
        class="no-selection-button no-price-line"
        >
        </sxm-ui-packages-comparison>
    `,
    props: {
        packages,
        familyDiscount: 5,
        endDate
    }
}));

stories.add('in-modal/select-vs-allaccess', () => ({
    moduleMetadata: {
        providers: [
            {
                provide: DataOfferService,
                useValue: {
                    allPackageDescriptions: ({ locale }) => {
                        return of([SELECT, ALL_ACCESS]);
                    }
                }
            }
        ]
    },
    template: `
    <sxm-ui-modal
    [showBackButton]="true"
    [titlePresent]="true"
    [closed]="false"
    title="Compare Packages">
        <sxm-ui-packages-comparison
        [packages]="packages"
        [familyDiscount]="familyDiscount"
        [endDate]="endDate"
        >
        </sxm-ui-packages-comparison>
    </sxm-ui-modal>
    `,
    props: {
        packages: packages,
        familyDiscount: 5,
        endDate
    }
}));

stories.add('in-modal/mostlymusic-vs-select', () => ({
    moduleMetadata: {
        providers: [
            {
                provide: DataOfferService,
                useValue: {
                    allPackageDescriptions: ({ locale }) => {
                        return of([MOSTLY_MUSIC, SELECT]);
                    }
                }
            }
        ]
    },
    template: `
        <sxm-ui-modal
        [showBackButton]="true"
        [titlePresent]="true"
        [closed]="false"
        title="Compare Packages">
            <sxm-ui-packages-comparison
            [packages]="packages"
            [familyDiscount]="familyDiscount"
            [endDate]="endDate"
            class="no-selection-button no-price-line"
            >
            </sxm-ui-packages-comparison>
        </sxm-ui-modal>
    `,
    props: {
        packages: packages2,
        familyDiscount: 5,
        endDate
    }
}));
