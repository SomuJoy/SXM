import { createSelector } from '@ngrx/store';
import { getCustomerDataCollection } from '@de-care/domains/account/state-branded-data-collection';

export const getFieldsToDisplay = createSelector(getCustomerDataCollection, (dataCollection) => {
    return dataCollection?.displayFields?.map((field) => field?.toLowerCase()?.replace(' ', ''));
});

export const getChatDetailsForRequest = createSelector(getCustomerDataCollection, (details) => ({
    botId: details.botId,
    conversationId: details.conversationId,
    userId: details.userId,
}));
