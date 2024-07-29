import { createSelector } from '@ngrx/store';
import { getFirstAccountSubscriptionBaseFollowonPlan, getFirstAccountSubscriptionFirstPlan, getIsCanada, getIsQuebec } from './selectors';
import { accountPlanTypeIsTrial } from '../helpers/account-helpers';

export const getCurrentPlanSummary = createSelector(getFirstAccountSubscriptionFirstPlan, getIsCanada, getIsQuebec, (plan, isCanada, isQuebec) => {
    return {
        planCode: plan && plan.code,
        packageName: plan && plan.packageName,
        type: plan && plan.type,
        termLength: plan && plan.termLength,
        price: plan && plan.price,
        endDate: plan && plan.endDate,
        marketType: plan && plan.marketType,
        isCanada,
        isTrial: accountPlanTypeIsTrial(plan.type),
        isQuebec
    };
});

export const getFollowOnPlanSummary = createSelector(getFirstAccountSubscriptionBaseFollowonPlan, getIsCanada, getIsQuebec, (followOnPlan, isCanada, isQuebec) =>
    !!followOnPlan
        ? {
              packageName: followOnPlan && followOnPlan.packageName,
              type: followOnPlan && followOnPlan.type,
              termLength: followOnPlan && followOnPlan.termLength,
              price: followOnPlan && followOnPlan.price,
              endDate: followOnPlan && followOnPlan.endDate,
              isCanada,
              isQuebec,
              isFollowon: true
          }
        : null
);

export const getCurrentPlanTermLength = createSelector(getFirstAccountSubscriptionFirstPlan, plan => plan?.termLength);
