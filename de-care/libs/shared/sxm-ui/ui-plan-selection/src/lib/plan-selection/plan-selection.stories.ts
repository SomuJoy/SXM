import { UserSettingsService } from '@de-care/settings';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { withMockSettings, withTranslation, MOCK_DATA_LAYER_PROVIDER, TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';
import { OffersModule, RetailPriceAndMrdEligibility } from '@de-care/offers';
import { DataOfferService } from '@de-care/data-services';
import { of } from 'rxjs';
import { SharedSxmUiUiPlanSelectionModule } from '../shared-sxm-ui-ui-plan-selection.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlanSelectionData } from './plan-selection.component';

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
const allPackageDescriptions: { name: string; packageName: string; features: any; channels: any[]; channelLineUpURL: string }[] = [
    {
        name: 'SiriusXM Music Showcase',
        packageName: 'SXM_SIR_AUD_PKG_MM',
        features: [...packageFeatures_first],
        channelLineUpURL: 'https://www.siriusxm.com/mostlymusicsxmcg',
        channels: [
            {
                title: '<b>SiriusXM Music Showcase Includes:</b>',
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
        name: 'SiriusXM Music & Entertainment',
        packageName: 'SXM_SIR_EVT',
        features: [...packageFeatures_first, ...packageFeatures_second],
        channelLineUpURL: 'https://www.siriusxm.com/Music & Entertainmentsxmcg',
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
        name: 'SiriusXM Platinum',
        packageName: 'SXM_SIR_ALLACCESS_FF',
        features: [...packageFeatures_first, ...packageFeatures_second, ...packageFeatures_third],
        channelLineUpURL: 'https://www.siriusxm.com/allaccesssxmcg',
        channels: [
            {
                title: '<b>SiriusXM Platinum Includes:</b>',
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

const packagesTwoPlans: { packageName: string; pricePerMonth: number }[] = [
    {
        packageName: 'SXM_SIR_AUD_PKG_MM',
        pricePerMonth: 10.99
    },
    {
        packageName: 'SXM_SIR_ALLACCESS_FF',
        pricePerMonth: 21.99
    }
];

const stories = storiesOf('shared/sxm-ui/plan-selection', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [OffersModule, SharedSxmUiUiPlanSelectionModule, BrowserAnimationsModule],
            providers: [...TRANSLATE_PROVIDERS, MOCK_DATA_LAYER_PROVIDER, MOCK_NGRX_STORE_PROVIDER, { provide: UserSettingsService, useClass: UserSettingsService }]
        })
    )
    .addDecorator(withMockSettings)
    .addDecorator(withTranslation);

stories.add('three-plans', () => ({
    moduleMetadata: {
        providers: [
            {
                provide: DataOfferService,
                useValue: {
                    allPackageDescriptions: ({ locale }) => of(allPackageDescriptions)
                }
            }
        ]
    },
    template: `<sxm-ui-plan-selection [isProactive]="true" [planSelectionData]="planSelectionData" [currentOrExpiredTrialPackage]="currentOrExpiredTrialPackage"></sxm-ui-plan-selection>`,
    props: {
        currentOrExpiredTrialPackage: 'SXM_SIR_ALLACCESS_FF',
        planSelectionData: {
            packages,
            selectedPackageName
        } as PlanSelectionData
    }
}));

stories.add('two-plans', () => ({
    moduleMetadata: {
        providers: [
            {
                provide: DataOfferService,
                useValue: {
                    allPackageDescriptions: ({ locale }) => of(allPackageDescriptions)
                }
            }
        ]
    },
    template: `<sxm-ui-plan-selection [isProactive]="true" [planSelectionData]="planSelectionData"></sxm-ui-plan-selection>`,
    props: {
        planSelectionData: {
            packages: packagesTwoPlans,
            selectedPackageName
        } as PlanSelectionData
    }
}));

stories.add('cancel-offer-grid', () => ({
    moduleMetadata: {
        providers: [
            {
                provide: DataOfferService,
                useValue: {
                    allPackageDescriptions: ({ locale }) => of(allPackageDescriptions)
                }
            }
        ]
    },
    template: `
        <div class="cancel-offer-grid">
            <sxm-ui-plan-selection [isProactive]="true" [planSelectionData]="planSelectionData" [currentOrExpiredTrialPackage]="currentOrExpiredTrialPackage">
                <div #contentCurrentPlanText current-plan-text>
                    Current Plan
                </div>
            </sxm-ui-plan-selection>
        </div>
    `,
    props: {
        currentOrExpiredTrialPackage: 'SXM_SIR_ALLACCESS_FF',
        planSelectionData: {
            packages,
            selectedPackageName
        } as PlanSelectionData
    }
}));
