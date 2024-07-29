interface Layer {
    event: string;
    [key: string]: any;
}

export const getAppEventData = () => cy.window().its('appEventData');
export const clearAppEventData = () => getAppEventData().then((appEventData) => (appEventData.length = 0));
export const appEventDataHasRecord = (record: unknown) =>
    getAppEventData().should((appEventData) => {
        expect(appEventData.map((r: unknown) => JSON.stringify(r))).to.contain(JSON.stringify(record));
    });
export const appEventDataHasPageRecord = ({ flowName, componentName }: { flowName: string; componentName: string }) =>
    getAppEventData().should((appEventData) => {
        const record = {
            event: 'page-loaded',
            pageInfo: { flowName, componentName },
        };
        expect(appEventData.map((r: unknown) => JSON.stringify(r))).to.contain(JSON.stringify(record));
    });
export const appEventDataHasComponentRecord = (componentName: string) =>
    getAppEventData().should((appEventData) => {
        const record = {
            event: 'component-loaded',
            componentInfo: { componentName },
        };
        expect(appEventData.map((r: unknown) => JSON.stringify(r))).to.contain(JSON.stringify(record));
    });
export const appEventDataHasFrontEndErrorRecord = (errorMessages: string[]) =>
    getAppEventData().should((appEventData) => {
        const record = {
            event: 'user-error',
            errors: errorMessages.map((errorName) => ({ errorType: 'USER', errorName })),
        };
        expect(appEventData.map((r: unknown) => JSON.stringify(r))).to.contain(JSON.stringify(record));
    });
export const appEventDataHasBusinessErrorRecord = (error: { errorCode: string; errorName: string }) =>
    getAppEventData().should((appEventData) => {
        expect(
            appEventData.some(
                (appEventDataRecord: Layer) =>
                    appEventDataRecord.event === 'business-error' &&
                    appEventDataRecord.errorInfo?.[0].errorCode === error.errorCode &&
                    appEventDataRecord.errorInfo?.[0].errorName === error.errorName
            )
        ).to.be.true;
    });
export const appEventDataHasClickRecord = (linkType: string, mustContainLinkNameValue: boolean) =>
    getAppEventData().should((appEventData) => {
        expect(
            appEventData.some(
                (appEventDataRecord: Layer) =>
                    appEventDataRecord.event === 'user-click' &&
                    appEventDataRecord.clickInfo?.linkType === linkType &&
                    (mustContainLinkNameValue ? appEventDataRecord.clickInfo?.linkName?.length > 0 : true)
            )
        ).to.be.true;
    });
