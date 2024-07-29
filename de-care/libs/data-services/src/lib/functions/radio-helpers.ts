import { AccountModel } from '../models/account.model';
import { PlanTypeEnum } from '../enums/plan-type.enum';
import { PlanModel } from '../models/plan.model';
import { Account } from '@de-care/domains/account/state-account';

export function isClosedRadio({ subscriptions, closedDevices }: AccountModel | Account) {
    return !(subscriptions && subscriptions[0]) && !!(closedDevices && closedDevices[0]);
}

export function hasActiveTrial({ subscriptions }: AccountModel | Account) {
    if (subscriptions && subscriptions[0] && subscriptions[0].plans) {
        for (let i = 0; i < subscriptions[0].plans.length; i++) {
            if (subscriptions[0].plans[i].type === 'TRIAL') {
                return true;
            }
        }
    }
    return false;
}

export function getRadioIdOnAccount(account: AccountModel): string | null {
    if (account.subscriptions && account.subscriptions.length > 0) {
        return account.subscriptions[0].radioService.last4DigitsOfRadioId;
    } else if (account.closedDevices && account.closedDevices.length > 0) {
        return account.closedDevices[0].last4DigitsOfRadioId;
    }
    return null;
}

// types as any, should be type Account
export function getFirstPlanByType(account: any, type: PlanTypeEnum): PlanModel | null {
    const subs = account.subscriptions || [];
    if (subs.length > 0) {
        const plans = subs[0].plans || [];
        const hasPlans = plans.length > 0;
        if (hasPlans) {
            const matching = plans.find((plan: PlanModel) => plan.type === type);
            return matching ? matching : null;
        }
    }
    return null;
}
