//********************************************************************************
export interface ICmsOffers {
    type: string;
    program_id: string;
    program_desc: string;
    offer_details_desc: string;
    plans: ICmsPlan[];
}

export interface ICmsPlan {
    plan_id: string;
    subtype: string;
    plan_desc: string;
    package: ICmsPackage;
}

export interface ICmsPackage {
    package_id: string;
    subtype: string;
    package_name: string;
    package_desc: string;
    package_listings: string;
    channels: ICmsChannel[];
}

export interface ICmsChannel {
    channel_name: string;
    category_name: string;
    subtype: string;
    channel_num: string;
    genre_name: string;
}


//========== CMS Tempate ============
export interface ICmsTemplate {
    template: string;
    updatedby: string;

    createddate: {
        value: Date;
        timezone: string;
        description: string;
    };

    Webreference: ICmsTemplateWebReference[];

    SPTParent: string;
    description: string;
    Publist: string[];

    program: {
        id: number;
        type: string;
    };

    startdate: null;
    SPTRank: 1;
    'Dimension-parent': any[];
    path: string;
    SegRating: any[];
    SPTNCode: string;
    createdby: string;
    subtype: string;
    externaldoctype: string;
    id: number;
    Body: string;
    Title: string;
    fw_uid: string;
    Dimension: string;

    modules: [
        {
            id: number;
            type: string;
        }
    ];

    enddate: string;
    filename: string;
    name: string;

    updateddate: {
        value: Date;
        timezone: string;
        description: string;
    };

    fwtags: string[];
    category: string;
    status: string;
    parents: any[];
}

export interface ICmsTemplateWebReference {
    patternid: number;
    wrapper: string;
    template: string;
    params: string;
    href: string;
    redirectWebRoot: string;
    default: boolean;
    webRoot: string;
    redirectUrl: string;
    httpStatus: number;
    deviceGroup: string;

    createdDate: {
        value: Date;
        timezone: string;
        description: string;
    };

    modifiedDate: {
        value: Date;
        timezone: string;
        description: string;
    };

    assetUrl: string;
}