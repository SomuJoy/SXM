import { getSubscriptionIdFromClosedDevice, AccountModel, DataLayerDataTypeEnum, CustomerInfoData } from '@de-care/data-services';
import { DataLayerService } from '@de-care/data-layer';

/**
 * @deprecated
 */
export function updateDataLayerOnClosedRadio(account: AccountModel, dataLayerInstance: DataLayerService) {
    const closedRadioSubscriptionId = getSubscriptionIdFromClosedDevice(account);

    if (closedRadioSubscriptionId) {
        let planInfo = dataLayerInstance.getData(DataLayerDataTypeEnum.PlanInfo) || {};
        planInfo = {
            ...planInfo,
            oldSubscriptionId: closedRadioSubscriptionId
        };
        dataLayerInstance.update(DataLayerDataTypeEnum.PlanInfo, planInfo);
    }
}

/**
 * @deprecated
 */
export function updateDataLayerWithMarketingId(marketingId: string, marketingAcctId: string, dataLayerInstance: DataLayerService) {
    const customerInfoObj: CustomerInfoData = dataLayerInstance.getData(DataLayerDataTypeEnum.CustomerInfo) || {};
    customerInfoObj.marketingId = marketingId;
    customerInfoObj.marketingAcctId = marketingAcctId;
    dataLayerInstance.update(DataLayerDataTypeEnum.CustomerInfo, customerInfoObj);
}

export function getDevicePromoCode(account: AccountModel): string {
    return getDevicePromoCodeFromSubscription(account) || getDevicePromoCodeFromClosedDevices(account) || null;
}

function getDevicePromoCodeFromSubscription(account: AccountModel) {
    const subscriptions = account?.subscriptions?.length > 0 ? account.subscriptions : null;
    return subscriptions ? subscriptions[0].devicePromoCode : null;
}

function getDevicePromoCodeFromClosedDevices(account: AccountModel) {
    const closedDevices = account?.closedDevices?.length ? account.closedDevices : null;
    const subscription = closedDevices ? closedDevices[0].subscription : null;
    return subscription?.status === 'Closed' ? subscription.devicePromoCode : null;
}
