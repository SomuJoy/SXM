import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiPrimaryPackageCardModule } from '../shared-sxm-ui-ui-primary-package-card.module';
import { PackageData } from './primary-package-card.component';

const stories = storiesOf('Component Library/ui/Primary Package', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, SharedSxmUiUiPrimaryPackageCardModule],
            providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER],
        })
    );

const packageData = {
    platformPlan: 'XM Select',
    priceAndTermDescTitle: '<span data-duration>12 months</span> for <span data-price>$5</span>/mo',
    processingFeeDisclaimer: 'Plus $2 processing fee. Then $16.99.<br/>See <strong>Offer Details</strong> below.',
    icons: {
        inside: { isActive: true, label: 'Inside the Car' },
        outside: { isActive: true, label: 'Outside the Car' },
        pandora: { isActive: false, label: 'Custom Stations' },
    },
    footer: 'Listen & watch your favorites in all your favorite places—in your car, on your phone, or at home.',
    detailsTitle: 'XM Select includes:',
    details: [
        '325+ channels in your car, on your phone, at home, and online',
        'Every MLB<span>&reg;</span> and NBA game. NHL<span>&reg;</span>, NCAA<span>&reg;</span> and PGA TOUR<span>&reg;</span> coverage',
        'Ad-free music and Xtra channels to stream for every mood and activity',
        'News, entertainment, comedy, and sports',
        'Thousands of shows and videos available on demand',
    ],
};
stories.add('default: theme retail (theme1)', () => ({
    template: `
        <sxm-ui-primary-package-card [packageData]="packageData"></sxm-ui-primary-package-card>
    `,
    props: {
        packageData,
    },
}));

stories.add('theme non-retail (theme2)', () => ({
    template: `
        <sxm-ui-primary-package-card class="theme-non-retail" [packageData]="packageData"></sxm-ui-primary-package-card>
    `,
    props: {
        packageData,
    },
}));

stories.add('default: icons show, closed details (presentation1)', () => ({
    template: `
        <sxm-ui-primary-package-card [packageData]="packageData"></sxm-ui-primary-package-card>
    `,
    props: {
        packageData,
    },
}));

stories.add('presentation icons show, opened details (presentation2)', () => ({
    template: `
        <sxm-ui-primary-package-card class="presentation-details-opened" [packageData]="packageData"></sxm-ui-primary-package-card>
    `,
    props: {
        packageData: {
            platformPlan: 'XM Select',
            priceAndTermDescTitle: '<span data-duration>12 months</span> for <span data-price>$5</span>/mo',
            processingFeeDisclaimer: 'Plus $2 processing fee. Then $16.99.<br/>See <strong>Offer Details</strong> below.',
            icons: {
                inside: { isActive: true, label: 'Inside the Car' },
                outside: { isActive: true, label: 'Outside the Car' },
                pandora: { isActive: false, label: 'Custom Stations' },
            },
            footer: 'Listen & watch your favorites in all your favorite places—in your car, on your phone, or at home.',
            detailsTitle: 'XM Select includes:',
            details: [
                '325+ channels in your car, on your phone, at home, and online',
                'Every MLB<span>&reg;</span> and NBA game. NHL<span>&reg;</span>, NCAA<span>&reg;</span> and PGA TOUR<span>&reg;</span> coverage',
                'Ad-free music and Xtra channels to stream for every mood and activity',
                'News, entertainment, comedy, and sports',
                'Thousands of shows and videos available on demand',
            ],
            presentation: 'Presentation2',
        },
    },
}));

stories.add('presentation no icons, single detail visible (presentation3)', () => ({
    template: `
        <sxm-ui-primary-package-card class="presentation-no-icons-single-detail-visible" [packageData]="packageData"></sxm-ui-primary-package-card>
    `,
    props: {
        packageData,
    },
}));

stories.add('with package features (single data plan)', () => ({
    template: `
        <sxm-ui-primary-package-card [packageData]="packageData"></sxm-ui-primary-package-card>
    `,
    props: {
        packageData: {
            ...packageData,
            platformPlan: 'NavWeather<sup>&trade;</sup>',
            priceAndTermDescTitle: '<span data-price>$4.99</span>/mo',
            packageFeatures: [
                {
                    packageName: 'NavTraffic',
                    features: [
                        {
                            shortDescription: 'Roadway incidents and conditions',
                            tooltipText: 'Alerts on major accidents, construction, and closings for most major roads nationwide',
                        },
                        { shortDescription: 'Traffic speed', tooltipText: 'Color-coded speed flows for traffic in major metro areas' },
                    ],
                },
            ],
            longDescription: '<p>Traffic conditions and incident alerts.*</p><sub>Some Travel Link Services are unavailable in certain vehicles.</sub>',
            processingFeeDisclaimer: 'See <strong>Offer Details</strong> below.',
            icons: null,
            details: null,
            detailsTitle: null,
            footer: '',
            theme: '',
            presentation: '',
        } as PackageData,
    },
}));

stories.add('with package features (data plan bundle)', () => ({
    template: `
        <sxm-ui-primary-package-card [packageData]="packageData"></sxm-ui-primary-package-card>
    `,
    props: {
        packageData: {
            ...packageData,
            platformPlan: 'XM News, Sports & Talk with NavTraffic<span>&reg;</span>',
            priceAndTermDescTitle: '<span data-price>$9.99</span>/mo',
            packageFeatures: [
                {
                    packageName: 'NavTraffic',
                    features: [
                        {
                            shortDescription: 'Roadway incidents and conditions',
                            tooltipText: 'Alerts on major accidents, construction, and closings for most major roads nationwide',
                        },
                        { shortDescription: 'Traffic speed', tooltipText: 'Color-coded speed flows for traffic in major metro areas' },
                    ],
                },
                {
                    packageName: 'XM News, Sports & Talk',
                    features: [{ shortDescription: 'Sports talk', tooltipText: 'Talk and analysis from the biggest names in sports' }],
                },
            ],
            longDescription:
                '<p>Traffic conditions and incident alerts. Real-time info on weather, fuel, parking, and more seamlessly integrated into your navigation system.*</p><sub>Some Travel Link Services are unavailable in certain vehicles.</sub>',
            processingFeeDisclaimer: 'See <strong>Offer Details</strong> below.',
            icons: null,
            details: null,
            detailsTitle: null,
            footer: '',
            theme: '',
            presentation: '',
        } as PackageData,
    },
}));

stories.add('presentation icons show, opened details (presentation4)', () => ({
    template: `
        <sxm-ui-primary-package-card class="presentation-details-opened" [packageData]="packageData"></sxm-ui-primary-package-card>
    `,
    props: {
        packageData: {
            platformPlan: 'XM Select',
            priceAndTermDescTitle: '<span data-duration>12 months</span> for <span data-price>$5</span>/mo',
            processingFeeDisclaimer: 'Plus $2 processing fee. Then $16.99.<br/>See <strong>Offer Details</strong> below.',
            icons: {
                inside: { isActive: true, label: 'Inside the Car' },
                outside: { isActive: true, label: 'Outside the Car' },
                pandora: { isActive: false, label: 'Custom Stations' },
            },
            footer: 'Listen & watch your favorites in all your favorite places—in your car, on your phone, or at home.',
            detailsTitle: 'XM Select includes:',
            details: [
                '325+ channels in your car, on your phone, at home, and online',
                'Every MLB<span>&reg;</span> and NBA game. NHL<span>&reg;</span>, NCAA<span>&reg;</span> and PGA TOUR<span>&reg;</span> coverage',
                'Ad-free music and Xtra channels to stream for every mood and activity',
                'News, entertainment, comedy, and sports',
                'Thousands of shows and videos available on demand',
            ],
            presentation: 'Presentation4',
        },
    },
}));

stories.add('with package features and learn more modal popup', () => ({
    template: `
        <sxm-ui-primary-package-card [packageData]="packageData"></sxm-ui-primary-package-card>
    `,
    props: {
        packageData: {
            platformPlan: 'SiriusXM Platinum VIP',
            priceAndTermDescTitle: '<span data-duration>12 months</span> for <span data-price>$5</span>/mo',
            processingFeeDisclaimer: 'Plus $2 processing fee. Then $16.99.<br/>See <strong>Offer Details</strong> below.',
            icons: {
                inside: { isActive: true, label: 'Inside the Car' },
                outside: { isActive: true, label: 'Outside the Car' },
                pandora: { isActive: false, label: 'Custom Stations' },
            },
            footer: 'Listen & watch your favorites in all your favorite places—in your car, on your phone, or at home.',
            detailsTitle: 'XM Select includes:',
            details: [],
            numberOfBullets: 2,
            packageFeatures: [
                {
                    packageName: 'SiriusXM Platinum VIP',
                    features: [
                        { shortDescription: '325+ channels in your car, on your phone, at home, and online' },
                        {
                            shortDescription:
                                '<strong>VIP Perks:</strong>\n' +
                                '<ul>\n' +
                                '\t<li>12 months of Apple Music</li>\n' +
                                '\t<li>12 months of discovery+</li>\n' +
                                '\t<li>Stitcher Premium</li>\n' +
                                '\t<li>nugs.net recorded concerts</li>\n' +
                                '\t<li>VIP-only event opportunities</li>\n' +
                                '\t<li>Dedicated customer service</li>\n' +
                                '</ul>\n',
                            name: 'VIP Perks',
                            learnMoreLinkText: 'Learn more about',
                            learnMoreInformation:
                                '<strong>Apple Music:&nbsp;</strong>Stream over 90 million songs and 30,000 playlists ad-free, online or off, and immerse yourself in spatial audio to hear sound all around. First 12 months free, then $9.99 per month billed by Apple.<br />\n' +
                                '<br />\n' +
                                '<strong>discovery+:&nbsp;</strong>&nbsp;Find something for everyone with instant access to discovery+ ad-lite. Your favorite genres and brands, plus exclusive originals, all in one place. First 12 months are on us, then $4.99 per month billed by discovery+. Terms apply.<br />\n' +
                                '<br />\n' +
                                '<strong>Stitcher:&nbsp;</strong>Enjoy exclusive access to Stitcher Premium&#39;s ad-free podcasts featuring your favorite hosts. Included with your Platinum VIP subscription for no additional charge.<br />\n' +
                                '<br />\n' +
                                '<strong>nugs.net:&nbsp;</strong>&nbsp;Enjoy special Platinum VIP subscriber access to stream 5000+ live concert audio and video recordings on demand through the nugs.net app.&nbsp;<br />\n' +
                                '<small>See <strong>Offer Details&nbsp;</strong>by closing this window.</small>',
                        },
                        { shortDescription: 'Ad-free music and Xtra channels to stream for every mood and activity' },
                    ],
                },
            ],
            presentation: 'Presentation4',
        } as PackageData,
    },
}));
