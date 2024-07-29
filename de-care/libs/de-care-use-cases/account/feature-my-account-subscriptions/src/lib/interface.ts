export interface ManageSubscriptionsDataModel {
    subId: string;
    radioId?: string;
}

export interface EditCreateSubscriptionsDataModel {
    subId: string;
    sameAsAccountUsername?: boolean;
    redirectToPhx: boolean;
}

export interface InactiveRadioModel {
    isAccountNonPay?: boolean;
    radioId?: string;
}
