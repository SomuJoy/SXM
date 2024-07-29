import { Account, Subscription } from '../data-services/account.interface';
import { CustomerTypeEnum, PlanTypeEnum } from '../data-services/account.enums';

export function maskEmail(email: string): string {
    const letterArray = email.split('');
    const emailString = letterArray.splice(letterArray.indexOf('@'), letterArray.length).join('');
    return `${letterArray[0]}*****${emailString}`;
}

export function getFirstSubscription(account: Account): Subscription | null {
    if (!account) {
        return null;
    }
    return account.subscriptions && account.subscriptions.length > 0 && account.subscriptions[0];
}

export function getSubscriptionIdFromAccount(account: Account): string | null {
    if (!account) {
        return null;
    }
    return account.subscriptions && account.subscriptions.length > 0 && account.subscriptions[0].id;
}

export function getFirstClosedDevice(account: Account) {
    if (!account) {
        return null;
    }
    return account.closedDevices && account.closedDevices.length > 0 ? account.closedDevices[0] : null;
}

export function getSubscriptionIdFromClosedDevice(account: Account): string | null {
    const firstClosedDevice = getFirstClosedDevice(account);
    return firstClosedDevice ? firstClosedDevice.subscription?.id : null;
}

export function getDevicePromoCode(account: Account) {
    const subscription = getFirstSubscription(account);
    const closedDevice = getFirstClosedDevice(account);
    return subscription ? subscription.devicePromoCode : closedDevice?.subscription?.devicePromoCode;
}

export function getFirstPlanFromAccount(account: Account) {
    const subscription = getFirstSubscription(account);
    const plans = subscription?.plans;
    return Array.isArray(plans) && plans.length > 0 ? plans[0] : null;
}

export function getMarketTypeFromAccount(account: Account): string {
    const firstPlan = getFirstPlanFromAccount(account);
    return firstPlan ? firstPlan.marketType : null;
}

export function getRevenueStatusFromAccount(account: Account): string {
    const firstPlan = getFirstPlanFromAccount(account);
    if (!!firstPlan) {
        return +firstPlan > 0 ? 'Immediate' : 'Deferred';
    }
    return null;
}

export function accountPlanTypeIsTrial(planType: string) {
    return planType === 'TRIAL';
}
export function accountPlanTypeIsPromo(planType: string) {
    return planType === 'PROMO' || planType === 'PROMO_MCP';
}
export function accountPlanTypeIsSelfPay(planType: string) {
    return planType === 'SELF_PAID' || planType === 'SELF_PAY';
}
export function accountPlanTypeIsDemo(planType: string) {
    return planType === 'DEMO';
}

export function isActiveSubscription(account: Account, subscriptionId: string): boolean {
    return !!subscriptionId || account?.subscriptions?.length > 0;
}

export function isRegisteredAccount(account: Account) {
    return (account && account.accountProfile && account.accountProfile.accountRegistered) || false;
}

export function isPlanPriceChangeMessagingType(type: string) {
    return type !== null && type !== '' && type !== undefined;
}

export function inTrialPostTrialSelfPayCustomerType(account, pvtTime, isStudent, subscriptionId = null) {
    let customerType: CustomerTypeEnum;
    let plan;
    let closedDevice;
    let accountRadioService;
    if (account.closedDevices && account.closedDevices.length > 0) {
        closedDevice = account.closedDevices[0];
    }
    if (account.subscriptions && account.subscriptions.length > 0) {
        if (subscriptionId) {
            for (const subscription of account.subscriptions) {
                if (subscriptionId === parseInt(subscription.id, 10)) {
                    accountRadioService = subscription.radioService;
                    plan = subscription.plans[0];
                }
            }
        } else {
            accountRadioService = account.subscriptions[0].radioService;
            plan = account.subscriptions[0].plans[0];
        }
    }
    if (account.isNewAccount) {
        customerType = isStudent ? CustomerTypeEnum.NewSxirStudent : CustomerTypeEnum.NewAccount;
    } else if (plan && plan.type === PlanTypeEnum.Trial) {
        const now = new Date(pvtTime);
        const startDate = new Date(plan.startDate);
        const endDate = new Date(plan.endDate);
        const post90Days = addDays(new Date(now), 90);
        if (now > startDate && now <= endDate) {
            accountRadioService ? (customerType = CustomerTypeEnum.InTrial) : (customerType = CustomerTypeEnum.InTrialStreaming);
        } else if (now > endDate && now <= post90Days) {
            customerType = CustomerTypeEnum.PostTrial;
        } else if (now > post90Days) {
            customerType = CustomerTypeEnum.WBGA;
        }
    } else if (closedDevice) {
        const closedDate = new Date(closedDevice.closedDate);
        const now = new Date(pvtTime);
        const post90Days = addDays(new Date(closedDate), 90);
        if (now >= closedDate && now <= post90Days) {
            const closedSubscription = closedDevice.subscription;
            if (closedSubscription && closedSubscription.plans) {
                for (let i = 0; i < closedSubscription.plans.length; i++) {
                    if (closedSubscription.plans[i].type === PlanTypeEnum.Trial) {
                        customerType = CustomerTypeEnum.PostTrial;
                        break;
                    } else {
                        customerType = CustomerTypeEnum.WBSP;
                    }
                }
            }
        } else {
            customerType = CustomerTypeEnum.WBGA;
        }
    } else if (
        plan &&
        (plan.type === PlanTypeEnum.SelfPaid ||
            plan.type === PlanTypeEnum.Introductory ||
            plan.type === PlanTypeEnum.SelfPay ||
            plan.type === PlanTypeEnum.Promo ||
            plan.type === PlanTypeEnum.PromoMCP ||
            plan.type === PlanTypeEnum.RtpOffer ||
            plan.type === PlanTypeEnum.LongTerm)
    ) {
        const now = new Date(pvtTime);
        const startDate = new Date(plan.startDate);
        if (now > startDate) {
            customerType = accountRadioService ? CustomerTypeEnum.SelfPay : CustomerTypeEnum.SelfPayStreaming;
        }
    }
    return customerType;
}

export function getLastFourDigitsOfAccountNumber(accountNumber: string) {
    return accountNumber.slice(accountNumber.length - 4, accountNumber.length);
}

export function isExpiredCreditCard(account: Account): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const creditCard = account?.billingSummary?.creditCard;
    const expYear = (+creditCard?.expiryYear || 0) < 100 ? +creditCard?.expiryYear + 2000 : +creditCard?.expiryYear;
    const expMonth = +creditCard?.expiryMonth || 0;
    if (!!creditCard?.last4Digits && (expYear < currentYear || (expMonth < currentMonth && expYear === currentYear))) {
        return true;
    }
    return false;
}

export function normalizeAccountNumber(accountNumber: string): string {
    if (accountNumber) {
        return accountNumber.replace(/[^0-9]+/, '');
    }
    return accountNumber;
}

export function last4DigitsOfRadioId(radio: string): string {
    return radio?.length > 3 ? radio?.slice(radio?.length - 4) : radio;
}

export function isPlanMarine(capabilities: string[]): boolean {
    const marineCodes = ['IND', 'OFF', 'CST', 'SKY', 'MAR', 'INL', 'FSH', 'CHA', 'VOY', 'FISHMAP'];
    return marineCodes.some((code) => capabilities?.includes(code));
}

export function isPlanAviation(capabilities: string[]): boolean {
    const aviationCodes = ['PIL', 'AVI', 'FORFLT', 'RSP'];
    return aviationCodes.some((code) => capabilities?.includes(code));
}

// TODO: Put this function in a commmon lib with scope:shared-util. Moving this here for now from date-helpers.ts in browser-common, to avoid module boundary error.
export function addDays(myDate: Date, days: number): Date {
    myDate.setDate(myDate.getDate() + days);
    return myDate;
}

export function isPlanAdvantage(planCode: string): boolean {
    return planCode.toLocaleLowerCase().includes('advantage');
}

export function isPlanAdvantageOrNextOrForwardOrNextBundleOrForwardBundle(planCode: string): boolean {
    const planCodesList = ['advantage', 'next', 'forward', 'next-bundle', 'forward-bundle'];
    return planCodesList.some((plan) => planCode.toLocaleLowerCase().includes(plan));
}

export function isPlanNextOrForwardBundle(planType: string): boolean {
    const planTypeList = ['next-bundle', 'forward-bundle'];
    return planTypeList.some((type) => planType.toLocaleLowerCase().includes(type));
}

export function isPlanMilitaryDiscount(planCode: string): boolean {
    return planCode.toLocaleLowerCase().includes('veteran');
}

export function isPlanEmployee(planCode: string): boolean {
    return planCode.toLocaleLowerCase().includes('employee');
}

export function isPlanNextOrForward(planCode: string): boolean {
    const planCodesList = ['next', 'forward'];
    return planCodesList.some((plan) => planCode.toLocaleLowerCase().includes(plan));
}

export function isPlanAllAccess(packageName: string): boolean {
    return packageName.includes('ALLACCESS');
}

export function isPlanSelect(packageName: string): boolean {
    return packageName.includes('_EVT');
}

export function isPlanMostlyMusic(packageName: string): boolean {
    return packageName.includes('_MM');
}

export function isPlanNST(packageName: string): boolean {
    return packageName.includes('_NS');
}

export function isPlanStreamingPlatinum(packageName: string): boolean {
    return packageName.includes('_IP_SA') && !isPlanStreamingME(packageName);
}

export function isPlanStreamingME(packageName: string): boolean {
    return packageName.includes('_ESNTL');
}

export function isPlanAudioCapable(capabilities: string[]): boolean {
    const audioCodes = ['AUD', 'IPAUD'];
    return audioCodes.some((code) => capabilities?.includes(code));
}

export function isPlanAlaCarte(planCode: string): boolean {
    return planCode.toLocaleLowerCase().includes('a la carte');
}

export function isPlanVoyager(planCode: string): boolean {
    return planCode.toLocaleLowerCase().includes('voyager');
}
