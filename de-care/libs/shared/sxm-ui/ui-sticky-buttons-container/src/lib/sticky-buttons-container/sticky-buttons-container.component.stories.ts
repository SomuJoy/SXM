import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiStickyButtonsContainerComponent, SharedSxmUiUiStickyButtonsContainerModule } from './sticky-buttons-container.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SharedSxmUiUiPackageCardModule } from '@de-care/shared/sxm-ui/ui-package-card';

type StoryType = SxmUiStickyButtonsContainerComponent;

export default {
    title: 'Component Library/__uncatagorized__/StickyButtonsContainerComponent',
    component: SxmUiStickyButtonsContainerComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiUiStickyButtonsContainerModule, SharedSxmUiUiPackageCardModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiStickyButtonsContainerComponent>;

const packageData = {
    packageTitle: 'Platinum',
    priceAndTermDescTitle: '$8.99/mo for 12 months',
    priceAfterTerm: 24.99,
    features: ['Music', 'News', 'Talk', 'All Sports', 'Howard Stern'],
};
export const Default: Story<StoryType> = (args: StoryType) => ({
    props: { ...args, packageData },
    template: `
    <div style="height: 750px">
    <div style="display:flex;gap: 8px;">
        <sxm-ui-package-card [packageData]="packageData"></sxm-ui-package-card>
        <sxm-ui-package-card [packageData]="packageData"></sxm-ui-package-card>
    </div>
    <sxm-ui-sticky-buttons-container>
    <button class="button primary" style="margin-top: 8px">CONTINUE TO CANCEL</button>
    <button class="button secondary" style="margin-top: 16px">BACK TO MY ACCOUNT</button>
    </sxm-ui-sticky-buttons-container>
    <section id="footerLinks">
        <ul>
            <li class="ng-star-inserted"><a target="_blank" rel="" class="tracklink"
                    href="https://www.siriusxm.com/sxm-web-terms-of-use?intcmp=OTHER_NA_www:Home_WebsiteTerms">Website
                    Terms</a></li>
            <li class="ng-star-inserted"><a target="_blank" rel="" class="tracklink"
                    href="https://www.siriusxm.com/customeragreement?intcmp=GN_FOOTER_NEW_CustomerAgreement">Customer
                    Agreement</a></li>
            <li class="ng-star-inserted"><a target="_blank" rel="" class="tracklink"
                    href="https://www.siriusxm.com/privacy-policy?intcmp=GN_FOOTER_NEW_PrivacyPolicy">Privacy Policy</a>
            </li>
            <li class="ng-star-inserted"><a target="_blank" rel="" class="tracklink"
                    href="https://shop.siriusxm.com/return-policy.html?intcmp=GN_FOOTER_NEW_ReturnPolicy">Return
                    Policy</a></li>
        </ul>
        <ul>
            <li class="ng-star-inserted"><a target="_blank" rel="" class="tracklink"
                    href="https://www.siriusxm.com/ccparequest_DoNotSellMyInfo">Do Not Sell My Info</a></li>
            <li class="ng-star-inserted"><a target="_blank" rel="" class="tracklink"
                    href="https://www.siriusxm.com/youradchoices?intcmp=GN_FOOTER_NEW_YourAdChoices">Your Ad Choices</a>
            </li>
            <li class="ng-star-inserted"><a target="_blank" rel="" class="tracklink"
                    href="https://www.siriusxm.com/fccpublicfile?intcmp=GN_FOOTER_NEW_FCCPublicFile">FCC Public File</a>
            </li>
            <li class="ng-star-inserted"><a target="_blank" rel="" class="tracklink"
                    href="https://www.siriusxm.com/fccinfo?intcmp=GN_FOOTER_NEW_FCCInfo">FCC Info</a></li>
        </ul>
    </section>
    <section id="copyright"> © <span class="year">2023</span> Sirius XM Radio Inc. </section>
</div>
    `,
});
