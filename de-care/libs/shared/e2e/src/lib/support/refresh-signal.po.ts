import { e2eRefreshSignalInCarSuccessMessage, e2eRefreshSignalOutOfCarSuccessMessage, e2eSendRefreshSignalButton } from '@de-care/refresh-device';

export const cyGetSendRefreshSignalButton = () => cy.get(e2eSendRefreshSignalButton);
export const cyGetRefreshSignalInCarSuccessMessage = () => cy.get(e2eRefreshSignalInCarSuccessMessage);
export const cyGetRefreshSignalOutOfCarSuccessMessage = () => cy.get(e2eRefreshSignalOutOfCarSuccessMessage);
