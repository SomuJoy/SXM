import { createSelector } from '@ngrx/store';
import {
    getCurrentSubscriptionFollowonPlans,
    getFollowonPlanSummary,
    getCurrentPlanSummary,
    getAllCurrentPlanSummaries,
    getAllFollowonPlanSummaries,
} from './state.selectors';

export const yourCurrentPlan = createSelector(getCurrentPlanSummary, getCurrentSubscriptionFollowonPlans, (currentPlan, followOnPlans) => {
    const paidFollowOnPlan = followOnPlans.find(({ type }) => type !== 'TRIAL' && type !== 'PROMO' && type !== 'PROMO_MCP' && type !== 'TRIAL_EXT');
    const isNotPaid = currentPlan.isTrial || currentPlan.type === 'PROMO' || currentPlan.type === 'PROMO_MCP' || currentPlan.type === 'TRIAL_EXT';
    return {
        ...currentPlan,
        fullPrice: isNotPaid ? paidFollowOnPlan?.price / paidFollowOnPlan?.termLength : currentPlan?.price / currentPlan?.termLength,
    };
});

export const getCurrentFollowOnPromoPlans = createSelector(
    getCurrentSubscriptionFollowonPlans,
    (followOnPlans) => followOnPlans?.filter((followOn) => followOn?.type?.includes('PROMO')) || []
);

export const getCurrentFollowOnPlansContainPromo = createSelector(getCurrentFollowOnPromoPlans, (followOnPlans) => followOnPlans?.length > 0);

export const getAllCurrentPlans = createSelector(getAllCurrentPlanSummaries, getFollowonPlanSummary, (allCurrentPlans, followonPlanSummary) => {
    let basePlans = allCurrentPlans.filter((plan) => plan.isBasePlan);

    const otherPlans = allCurrentPlans
        .filter((plan) => !plan.isBasePlan)
        .sort((planA, planB) => {
            if (planA.type === planB.type) {
                return 0;
            } else if (planA.type.length < planB.type.length) {
                return -1;
            } else {
                return 1;
            }
        })
        .map((plan, i) => ({
            ...plan,
            endDate: i === allCurrentPlans.length - 2 ? plan.endDate : null,
        }));

    if (basePlans && otherPlans && otherPlans.length > 0) {
        basePlans = basePlans.map((plan) => ({ ...plan, endDate: plan.dataCapable ? null : plan.endDate }));
    }

    return [...basePlans, ...otherPlans].filter(Boolean).map((planSummary) => {
        const isNotPaid = planSummary?.type === 'TRIAL' || planSummary?.type === 'PROMO' || planSummary?.type === 'PROMO_MCP' || planSummary?.type === 'TRAIL_EXT';
        return {
            ...planSummary,
            fullPrice: isNotPaid ? followonPlanSummary?.price / followonPlanSummary?.termLength : planSummary?.price / planSummary?.termLength,
        };
    });
});

export const getFollowonPlanWithFullPrice = createSelector(getFollowonPlanSummary, getCurrentSubscriptionFollowonPlans, (followOnPlan, followOnPlans) => {
    const paidFollowOnPlan = followOnPlans.find(({ type }) => type !== 'TRIAL' && type !== 'PROMO' && type !== 'PROMO_MCP' && type !== 'TRIAL_EXT');
    const isNotPaid = followOnPlan?.type === 'TRIAL' || followOnPlan?.type === 'PROMO' || followOnPlan?.type === 'PROMO_MCP' || followOnPlan?.type === 'TRIAL_EXT';

    return {
        ...followOnPlan,
        fullPrice: isNotPaid ? paidFollowOnPlan?.price : followOnPlan?.price,
        fullPriceTermLength: isNotPaid ? paidFollowOnPlan?.termLength : followOnPlan?.termLength,
    };
});

export const getFollowonPlan = createSelector(yourCurrentPlan, getFollowonPlanWithFullPrice, (currentPlan, followOnPlan) =>
    !!followOnPlan.fullPrice && currentPlan.type === 'TRIAL' ? followOnPlan : null
);

export const getAllFollowOnPlans = createSelector(getAllCurrentPlans, getAllFollowonPlanSummaries, (currentPlans, allFollowOnPlans) => {
    return allFollowOnPlans.length > 0 && currentPlans.find(({ type }) => type === 'TRIAL')
        ? allFollowOnPlans.map((followOnPlan) => {
              return {
                  ...followOnPlan,
                  fullPrice: followOnPlan?.price,
                  fullPriceTermLength: followOnPlan?.termLength,
              };
          })
        : [];
});

export const getAllFollowOnPlansWithFullPrice = createSelector(getAllFollowOnPlans, (allFollowOnPlans) => {
    let selfPayFollowOnPlan;
    return allFollowOnPlans
        .map((currentFollowOnPlan) => {
            if (
                currentFollowOnPlan?.type === 'TRIAL' ||
                currentFollowOnPlan?.type === 'PROMO' ||
                currentFollowOnPlan?.type === 'PROMO_MCP' ||
                currentFollowOnPlan?.type === 'TRIAL_EXT'
            ) {
                selfPayFollowOnPlan = allFollowOnPlans.find(
                    ({ type, packageName }) =>
                        type !== 'TRIAL' && type !== 'PROMO' && type !== 'PROMO_MCP' && type !== 'TRIAL_EXT' && packageName === currentFollowOnPlan.packageName
                );
                return {
                    ...currentFollowOnPlan,
                    fullPrice: !!selfPayFollowOnPlan ? selfPayFollowOnPlan?.price : currentFollowOnPlan.price,
                    fullPriceTermLength: !!selfPayFollowOnPlan ? selfPayFollowOnPlan?.termLength : currentFollowOnPlan.termLength,
                };
            }
            return currentFollowOnPlan;
        })
        .filter((currentFollowOnPlan) => !Object.is(currentFollowOnPlan, selfPayFollowOnPlan));
});
