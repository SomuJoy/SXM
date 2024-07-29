export interface ServerResponseProspectModel {
    firstname: string;
    lastname: string;
    username: string;
    trialstartdate: string;
    trialenddate: string;
    promocode: string;
}

export interface BaseProspectModel {
    firstName: string;
    lastName: string;
}

export type ActivationProspectModel = BaseProspectModel & {
    username: string;
    trialstartdate: string;
    trialenddate: string;
    promocode: string;
};

export type OneStepActivationProspectModel = BaseProspectModel & {
    zipCode: string;
};

// ProspectModel can contain any number of pre-fill parameters
export type ProspectModel = Partial<ActivationProspectModel & OneStepActivationProspectModel>;
