import { UserSettingsService } from '@de-care/settings';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { withMockSettings, withTranslation, MOCK_DATA_LAYER_PROVIDER, TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
import { OffersModule, PlanComparisonGridParams, RetailPriceAndMrdEligibility } from '@de-care/offers';
import { FollowOnPlanSelectionData } from './follow-on-selection.component';
import { DataOfferService } from '@de-care/data-services';
import { of } from 'rxjs';
import { SxmUiModule } from '@de-care/sxm-ui';
import { HeroTitleTypeEnum } from '@de-care/domains/offers/ui-hero';
import { SharedSxmUiUiFollowOnSelectionModule } from '../shared-sxm-ui-ui-follow-on-selection.module';
import { SharedSxmUiUiPlanComparisonGridModule } from '@de-care/shared/sxm-ui/ui-plan-comparison-grid';

const packageFeatures_first: { name: string; tooltipText?: string; count: string | null }[] = [
    {
        name: 'Ad-free music channels',
        count: '5',
        tooltipText: null
    },
    {
        name: '24/7 news, talk and comedy',
        count: '',
        tooltipText: null
    }
];
const packageFeatures_second: { name: string; tooltipText?: string; count: string | null }[] = [
    {
        name: 'Sports talk and analysis',
        count: '',
        tooltipText: null
    },
    {
        name: 'SiriusXM video',
        count: '',
        tooltipText:
            'SiriusXM video clips include exclusive live performances, in-studio sessions, groundbreaking interviews, breaking ' +
            'stories, celebrity visits, and in-depth conversations. Available online and on the app.'
    },
    {
        name: 'MLB<sup>&reg;</sup>, NBA<sup>&reg;</sup>, NHL<sup>&reg;</sup> and PGA<sup>&reg;</sup> Play-by-play',
        count: '',
        tooltipText: 'Play-by-play from your hometown crew, talk and analysis, and channels for every major sport, college, and fantasy.'
    }
];
const packageFeatures_third: { name: string; tooltipText?: string; count: string | null }[] = [
    {
        name: 'NFL<sup>&reg;</sup> and NASCAR<sup>&reg;</sup> Play-by-play',
        count: '',
        tooltipText: 'Every game and race, plus 24/7 exclusive talk channels dedicated to NFL and NASCAR.'
    },
    {
        name: 'Howard Stern channels and video',
        count: '',
        tooltipText:
            'Home of the King of All Media, listen and watch the best celebrity interviews, behind-the-scenes antics & more. Includes' +
            ' access to the exclusive Howard Stern video library. Video content only available online and on the app.'
    },
    {
        name: 'New! Personalized Stations Powered by Pandora<sup>&reg;</sup>',
        count: '',
        tooltipText: `We've brought the power of Pandora inside the SiriusXM app so you can create your own personalized ad-free music
            stations. Just start your station by selecting an artist or song you're listening to on the SiriusXM app. Available online
            and on the app.`
    },
    {
        name: 'Xtra channels for every mood and activity',
        count: '',
        tooltipText: 'Over 100 new channels for you to enjoy even more variety from every decade and music style you love. Available ' + 'online and on the app.'
    }
];
const selectedPackageName: string = 'SXM_SIR_ALLACCESS_FF';
const leadOfferPackageName: string = 'SXM_SIR_ALLACCESS_FF';
const packageNames = ['SXM_SIR_AUD_PKG_MM', 'SXM_SIR_EVT', 'SXM_SIR_ALLACCESS_FF'];
const retailPrices: RetailPriceAndMrdEligibility[] = [
    { pricePerMonth: 10.99, mrdEligible: false },
    { pricePerMonth: 16.99, mrdEligible: true },
    {
        pricePerMonth: 21.99,
        mrdEligible: true
    }
];
const allPackageDescriptions: { name: string; packageName: string; features: any; channels: any[]; channelLineUpURL: string }[] = [
    {
        name: 'SiriusXM Mostly Music',
        packageName: 'SXM_SIR_AUD_PKG_MM',
        features: [...packageFeatures_first],
        channelLineUpURL: 'https://www.siriusxm.com/mostlymusicsxmcg',
        channels: [
            {
                title: '<b>SiriusXM Mostly Music Includes:</b>',
                count: '85+',
                descriptions: [
                    'Ad-free music',
                    'Select news, talk and entertainment channels',
                    'Joel Osteen Radio, BBC World',
                    'Service News, NPR<sup>&reg;</sup>, Kids Place Live, and more'
                ],
                features: [
                    {
                        name: 'Ad-free music channels',
                        count: '60+',
                        tooltipText: null
                    },
                    {
                        name: '24/7 news, talk, sport and comedy',
                        count: null,
                        tooltipText: null
                    },
                    {
                        name: 'Change or cancel at any time',
                        count: null,
                        tooltipText: null
                    }
                ]
            }
        ]
    },
    {
        name: 'SiriusXM Select',
        packageName: 'SXM_SIR_EVT',
        features: [...packageFeatures_first, ...packageFeatures_second],
        channelLineUpURL: 'https://www.siriusxm.com/selectsxmcg',
        channels: [
            {
                title: '<b>SiriusXM Select Includes:</b>',
                count: '325+',
                descriptions: [
                    'Ad-free music, plus news, talk, & entertainment',
                    'SiriusXM video',
                    '100+ Xtra music channels',
                    'MLB<sup>&reg;</sup>, NBA, NHL<sup>&reg;</sup> games, the PGA TOUR<sup>&reg;</sup>, college sports',
                    '24/7 comedy channels'
                ],
                features: [
                    {
                        name: 'Ad-free music channels',
                        count: '240+',
                        tooltipText: null
                    },
                    {
                        name: 'Listen outside the car',
                        count: null,
                        tooltipText: null
                    },
                    {
                        name: 'SiriusXM video',
                        count: null,
                        tooltipText: 'Exclusive live performances, in-studio sessions, groundbreaking interviews, available online and on the app.'
                    },
                    {
                        name: 'MLB<sup>&reg;</sup>, NBA<sup>&reg;</sup>, NHL<sup>&reg;</sup> and PGA<sup>&reg;</sup> Play-by-play',
                        count: null,
                        tooltipText: 'Play-by-play from your hometown crew, along with 24/7 exclusive MLB, NBA, NHL, and PGA channels. Plus dedicated Fantasy Sports channels.'
                    },
                    {
                        name: '24/7 news, talk, sport and comedy',
                        count: null,
                        tooltipText: null
                    },
                    {
                        name: 'Change or cancel at any time',
                        count: null,
                        tooltipText: null
                    }
                ]
            }
        ]
    },
    {
        name: 'SiriusXM All Access',
        packageName: 'SXM_SIR_ALLACCESS_FF',
        features: [...packageFeatures_first, ...packageFeatures_second, ...packageFeatures_third],
        channelLineUpURL: 'https://www.siriusxm.com/allaccesssxmcg',
        channels: [
            {
                title: '<b>SiriusXM All Access Includes:</b>',
                count: '350+',
                descriptions: [
                    'Personalized Stations Powered by Pandora',
                    'Ad-free music, plus news, talk, & entertainment',
                    'SiriusXM video including Howard Stern',
                    '100+ Xtra music channels',
                    'Howard Stern channels',
                    'Every NFL, MLB<sup>&reg;</sup>, NBA game, & NASCAR<sup>&reg;</sup> race, NHL<sup>&reg;</sup> games, the PGA TOUR<sup>&reg;</sup>, college sports',
                    '24/7 comedy channels'
                ],
                features: [
                    {
                        name: 'Ad-free music channels',
                        count: '240+',
                        tooltipText: null
                    },
                    {
                        name: 'Listen outside the car',
                        count: null,
                        tooltipText: null
                    },
                    {
                        name: 'SiriusXM video',
                        count: null,
                        tooltipText: 'Exclusive live performances, in-studio sessions, groundbreaking interviews, available online and on the app.'
                    },
                    {
                        name: 'MLB<sup>&reg;</sup>, NBA<sup>&reg;</sup>, NHL<sup>&reg;</sup> and PGA<sup>&reg;</sup> Play-by-play',
                        count: null,
                        tooltipText: 'Play-by-play from your hometown crew, along with 24/7 exclusive MLB, NBA, NHL, and PGA channels. Plus dedicated Fantasy Sports channels.'
                    },
                    {
                        name: 'Howard Stern channels and video',
                        count: null,
                        tooltipText: `Home of the King of All Media, listen and watch the best celebrity interviews, behind-the-scenes antics & more.
                            Includes access to the exclusive Howard Stern video library. Video content only available online and on the app.`
                    },
                    {
                        name: 'NFL<sup>&reg;</sup> and NASCAR<sup>&reg;</sup> Play-by-play',
                        count: null,
                        tooltipText: 'Every game and race, plus 24/7 exclusive talk channels dedicated to NFL and NASCAR.'
                    },
                    {
                        name: 'Pandora Stations',
                        count: null,
                        tooltipText: null
                    },
                    {
                        name: '24/7 news, talk, sport and comedy',
                        count: null,
                        tooltipText: null
                    },
                    {
                        name: 'Change or cancel at any time',
                        count: null,
                        tooltipText: null
                    }
                ]
            }
        ]
    }
];
const trialEndDate: string = '2020-06-25';
const packages: { packageName: string; pricePerMonth: number }[] = [
    {
        packageName: 'SXM_SIR_AUD_PKG_MM',
        pricePerMonth: 10.99
    },
    {
        packageName: 'SXM_SIR_EVT',
        pricePerMonth: 16.99
    },
    {
        packageName: 'SXM_SIR_ALLACCESS_FF',
        pricePerMonth: 21.99
    }
];

const leadOfferTerm = 3;

const leadOfferEndDate: string = '2/27/2050';

const stories = storiesOf('shared/sxm-ui/follow-on-selection', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiFollowOnSelectionModule, SharedSxmUiUiPlanComparisonGridModule],
            providers: [...TRANSLATE_PROVIDERS, MOCK_DATA_LAYER_PROVIDER, { provide: UserSettingsService, useClass: UserSettingsService }]
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
                    allPackageDescriptions: ({ locale }) => of(allPackageDescriptions)
                },
                packageNames
            }
        ]
    },
    //component: [FollowOnSelectionComponent],
    template: `<sxm-ui-follow-on-selection [planSelectionData]="planSelectionData"></sxm-ui-follow-on-selection>`,
    props: {
        planSelectionData: {
            leadOfferEndDate,
            packages,
            selectedPackageName,
            leadOfferPackageName
        } as FollowOnPlanSelectionData,
        packageNames
    }
}));

stories.add('w/ grid', () => ({
    moduleMetadata: {
        providers: [
            {
                provide: DataOfferService,
                useValue: {
                    allPackageDescriptions: ({ locale }) => of(allPackageDescriptions)
                },
                packageNames
            }
        ]
    },
    template: `
        <sxm-ui-follow-on-selection [planSelectionData]="planSelectionData"></sxm-ui-follow-on-selection>
        <sxm-ui-plan-comparison-grid [packageNames]="packageNames" [retailPrices]="retailPrices" [planComparisonGridParams]="planSelectionData"></sxm-ui-plan-comparison-grid>
    `,
    props: {
        planSelectionData: {
            selectedPackageName,
            leadOfferPackageName,
            leadOfferTerm,
            trialEndDate,
            packages
        } as PlanComparisonGridParams,
        packageNames,
        retailPrices
    }
}));

stories.add('w/ grid, modal, and sticky row', () => ({
    moduleMetadata: {
        imports: [SxmUiModule],
        providers: [
            {
                provide: DataOfferService,
                useValue: {
                    allPackageDescriptions: ({ locale }) => of(allPackageDescriptions)
                },
                packageNames
            }
        ]
    },
    template: `
        <sxm-ui-modal class="modal--full-view modal--content-grid" [closed]="false" title="Subscription Options" [titlePresent]="true">
            <sxm-ui-follow-on-selection class="stick-to-top" [planSelectionData]="planSelectionData"></sxm-ui-follow-on-selection>
            <sxm-ui-plan-comparison-grid [packageNames]="packageNames" [retailPrices]="retailPrices" [planComparisonGridParams]="planSelectionData"></sxm-ui-plan-comparison-grid>
        </sxm-ui-modal>
    `,
    props: {
        planSelectionData: {
            selectedPackageName,
            leadOfferPackageName,
            leadOfferTerm,
            trialEndDate,
            packages
        } as PlanComparisonGridParams,
        packageNames,
        retailPrices
    }
}));

stories.add('w/ grid, on page, w/o sticky row ', () => ({
    moduleMetadata: {
        imports: [SxmUiModule],
        providers: [
            {
                provide: DataOfferService,
                useValue: {
                    allPackageDescriptions: ({ locale }) => of(allPackageDescriptions)
                },
                packageNames,
                retailPrices
            }
        ]
    },
    template: `
    <div class="background-black">
        <div class="content-container">
            <div class="row align-center no-padding-small">
                <div class="column small-12 medium-8 no-padding-medium">
                    <div class="flex align-middle" style="width: 100%; min-height: 45px;">
                        <img style="height: 26px; max-width: 135px;"alt="SiriusXM" class="sxm-nav-logo" src="assets/img/sxm-logo-white.png">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hero-component [showImage]="false" [heroTitleType]="heroTitleType" termLength="3" packageName="All Access" price="2" [alignLeftMediumUp]="true"></hero-component>
    <div class="content-container">
        <div class="row align-center">
           <div class="column small-12 medium-8 no-padding-small background-white" style="margin: 15px 0;">
                <sxm-ui-follow-on-selection [planSelectionData]="planSelectionData"></sxm-ui-follow-on-selection>
                <sxm-ui-plan-comparison-grid [packageNames]="packageNames" [retailPrices]="retailPrices" [planComparisonGridParams]="planSelectionData"></sxm-ui-plan-comparison-grid>
            </div>
        </div>
    </div>
     <div class="background-offwhite">
        <div class="content-container">
            <div class="row align-center no-padding-small">
                <div class="column small-12 medium-8 no-padding-medium">
                    <div class="flex align-middle" style="width: 100%; min-height: 45px;">
                        <important-info></important-info>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    props: {
        planSelectionData: {
            selectedPackageName,
            leadOfferPackageName,
            leadOfferTerm,
            trialEndDate,
            packages
        } as PlanComparisonGridParams,
        packageNames,
        retailPrices,
        heroTitleType: HeroTitleTypeEnum.Renewal
    }
}));
