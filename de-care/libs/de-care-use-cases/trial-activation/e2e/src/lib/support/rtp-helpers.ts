import { cyGetCreateAccountSubmitButton } from './nouv-rtp.po';
import { cyGetPlanComparisonGrid, cyGetFollowOnSelectionOptions, cyGetRtcPlanComparisonGridButton } from './rtp.po';

export enum RTCSelectOptionEnum {
    CHOICE = 0,
    SELECT = 1,
    ALL_ACCESS = 2
}

// export function fillAccountInfoForm(radioId: string, accountNumber: string): void {
//     cyGetAccountInfoRadioId().then(() => {
//         cyGetAccountInfoRadioId().type(radioId);
//     });
//     cyGetAccountInfoAccountNumber().then(() => {
//         cyGetAccountInfoAccountNumber().type(accountNumber);
//     });
// }

export function fillOutPaymentFormAndSelectChoiceAndSelectGenre(option: RTCSelectOptionEnum = RTCSelectOptionEnum.CHOICE) {
    cyGetCreateAccountSubmitButton().click({ force: true });
    cyGetCreateAccountSubmitButton()
        .click({ force: true })
        .then(() => {
            selectPlanGridOptionAndContinue(option);
        });
}

export function selectPlanGridOptionAndContinue(option: RTCSelectOptionEnum): void {
    cyGetPlanComparisonGrid().then(() => {
        cyGetFollowOnSelectionOptions()
            .eq(option)
            .click({ force: true })
            .then(() => {
                cyGetRtcPlanComparisonGridButton().click({ force: true });
            });
    });
}
