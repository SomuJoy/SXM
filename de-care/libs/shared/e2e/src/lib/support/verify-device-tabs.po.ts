import {
    e2eVerifyDeviceTabsFlepzForm,
    e2eAccountInfoTabDataAttr,
    e2eFlepzCarInfoTabDataAttr,
    e2eFlepzYourInfoTabDataAttr,
    e2eVerifyDeviceTabs
} from '@de-care/identification';

export const cyGetE2EVerifyDeviceTabsFlepzForm = () => cy.get(e2eVerifyDeviceTabsFlepzForm);
export const cyGetE2EAccountInfoTabDataAttr = () => cy.get(e2eAccountInfoTabDataAttr);
export const cyGetE2EFlepzCarInfoTabDataAttr = () => cy.get(e2eFlepzCarInfoTabDataAttr);
export const cyGetE2EFlepzYourInfoTabDataAttr = () => cy.get(e2eFlepzYourInfoTabDataAttr);
export const cyGetE2EVerifyDeviceTabs = () => cy.get(e2eVerifyDeviceTabs);
export const cyGetE2EVerifyDeviceTabsCarInfoButtonTab = () => cy.get(`${e2eVerifyDeviceTabs} ${e2eFlepzCarInfoTabDataAttr}`);
