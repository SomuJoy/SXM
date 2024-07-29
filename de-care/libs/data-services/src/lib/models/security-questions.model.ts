export interface SecurityQDataModel {
    securityQuestions: SecurityQuestionsModel[];
    registerResponse?: boolean;
}

export interface SecurityQuestionsModel {
    id?: number;
    question?: string;
}
