import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiPackageCardComponent, SharedSxmUiUiPackageCardModule } from './package-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';

type StoryType = SxmUiPackageCardComponent;

const packageData = {
    packageTitle: 'Platinum',
    priceAndTermDescTitle: '$8.99/mo for 12 months',
    priceAfterTerm: 24.99,
    features: ['Music', 'News', 'Talk', 'All Sports', 'Howard Stern'],
};
export default {
    title: 'Component Library/__uncatagorized__/PackageCardComponent',
    component: SxmUiPackageCardComponent,
    decorators: [
        withKnobs,
        moduleMetadata({
            imports: [TranslateModule.forRoot(), BrowserAnimationsModule, SharedSxmUiUiPackageCardModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiPackageCardComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        packageData,
        onPackageSelected: action('@Output() addCarSubscriptionButtonClick'),
    },
    template: `<sxm-ui-package-card [packageData]="packageData"></sxm-ui-package-card>`,
});
