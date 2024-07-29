/**
 * This contains a mapping between query params from external sources
 * and the query params used internally. It helps insulate against
 * changes to the external params so that we don't need to change the
 * internal ones. We can also map multiple different external params
 * to the same internal one to account for different casing and spelling.
 */
export enum ContestExternalQueryParams {
    contestid = 'contestid',
    contestrules = 'contestrules',
    constesteligible = 'contestelligible'
}

export enum ContestParams {
    contestId = 'contestId',
    contestUrl = 'contestRules',
    contestEligible = 'contestEligible'
}

// Here we can map multiple external keys to the same internal one
export const contestQueryParamMap = {
    [ContestExternalQueryParams.contestid]: ContestParams.contestId,
    [ContestExternalQueryParams.contestrules]: ContestParams.contestUrl,
    [ContestExternalQueryParams.constesteligible]: ContestParams.contestEligible
};
