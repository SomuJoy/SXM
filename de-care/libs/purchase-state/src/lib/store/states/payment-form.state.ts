export interface Paymentform {
    formStep: number;
    formStepNumberForErrorRedirects: number;
    btnStatus: boolean;
    isFlepz: boolean;
    loading: boolean;
    upsellCode: string;
}

export const initialPaymentFormState: Paymentform = {
    formStep: 1,
    formStepNumberForErrorRedirects: 1,
    btnStatus: false,
    isFlepz: false,
    loading: false,
    upsellCode: null
};
