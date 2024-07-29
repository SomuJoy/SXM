export const getDigitalData = () => cy.window().its('digitalData');
export const getDigitalDataPageInfo = () => getDigitalData().its('pageInfo');
export const getDigitalDataErrorInfo = () => getDigitalData().its('errorInfo');
export const getDigitalDataFrontEndErrors = () => getDigitalDataErrorInfo().its('frontEndError');
export const getDigitalDataDeviceInfo = () => getDigitalData().its('deviceInfo');
export const getDigitalDataCustomerInfo = () => getDigitalData().its('customerInfo');
export const expectDigitalDataToBeAnObject = () =>
    getDigitalData().then(function (digitalData) {
        assert.isObject(digitalData);
    });
