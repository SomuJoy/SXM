//********************************************************************************
export interface ICmsVanity {
    type: string;

    webRoot: string;
    httpstatus: number;
    webreferenceURL: string;
    resolvedURL: string;

    assetid: number;
    assettype: string;
    codetype: string;

    field: string;
    fieldIndex: number;
    patternid: number;
    devicegroup: string;
    template: string;
    wrapper: string;
    params: string;

    modifieddate: {
        value: Date,
        timezone: string;
        description: string;
    };

    createddate: {
        value: Date,
        timezone: string;
        description: string;
    };

    redirectURL: string;
    redirectWebRoot: string;
    startDate: string;
    endDate: string;
    default: boolean;
    permanentRedirect: boolean;
    temporaryRedirect: boolean;
    notFound: boolean;
    redirect: boolean;
}