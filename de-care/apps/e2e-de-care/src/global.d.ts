// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
        stubSockJs(): void;
        stubCmsCampaignSuccess(): void;
        stubCmsCampaignAssetsSuccess(): void;
        stubCmsCampaignHeroAssetsSuccess(): void;
        stubCmsCampaignHeroAssetsNoBackgroundSuccess(): void;
        stubCmsCampaignHeroAssetImage(): void;
        stubCmsCampaignHeroAssetBackgroundImage(): void;
        primaryPackageCardIsVisibleAndContains(text: string): void;
        packageCardBasicIsVisibleAndContains(text: string[]): void;
        featuresListIsVisibleAndContains(text: string[]): void;
        productBannerIsVisibleAndContains(text: string[]): void;
        fillOutSecurityQuestions(): void;
        fillOutAndSubmitAccountRegistrationForm(options: { includePassword: boolean }): void;
        selectValueInDropdown(selector: string, value: string): void;
        stubAuthenticateLoginSuccess(): void;
        appEventDataContainsUserErrors(errors: string[]): void;
    }
}
