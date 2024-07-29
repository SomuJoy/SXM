declare namespace Cypress {
    interface PartialHAR {
        request: {
            method: string;
            url: string;
        };
        response: {
            mimeType: string;
            text: any;
        };
    }

    interface Chainable<Subject> {
        sxmEnsureNoMissingTranslations(): void;
        sxmWaitForSpinner(): void;
        sxmMockIpConfig(): void;
        sxmMockAllPackageDesc(): void;
        sxmMockEnvInfo(): void;
        sxmMockCardBinRanges(): void;
        sxmCheckPageLocation(expectedPath: string): void;
        sxmReplaceMockFromHAR(mocks: { [key: string]: PartialHAR[] }, alias: string, index: number): void;
        sxmIsCanadaMode(): boolean;
        sxmMockEmailIdentityValidationSuccess(): void;
        sxmMockPasswordValidationSuccess(): void;
        sxmMockEmailValidationSuccess(): void;
        sxmMockAddressesAndCCValidationSuccess(): void;
        sxmMockIP2LocationSuccess(): void;
    }
}
