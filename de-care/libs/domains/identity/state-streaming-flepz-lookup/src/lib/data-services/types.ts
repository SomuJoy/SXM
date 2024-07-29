export type EligibilityType = 'CREATE_LOGIN' | 'LISTEN_NOW' | 'FREE_PREVIEW';
export type EligibleServiceType = 'SXIR_STANDALONE' | 'SXIR_LINKED';

export enum PlanTypeEnum {
    Trial = 'TRIAL',
    Introductory = 'INTRODUCTORY',
    Promo = 'PROMO',
    Courtesy = 'COURTESY',
    Demo = 'DEMO',
    Unset = 'UNSET',
    SelfPaid = 'SELF_PAID',
    SelfPay = 'SELF_PAY',
    PromoMCP = 'PROMO_MCP',
    TrialExtension = 'TRIAL_EXT',
    TrialExtensionRTC = 'TRIAL_EXT_RTC',
    RtpOffer = 'RTP_OFFER',
    TrialRtp = 'TRIAL_RTP',
    TrialGgle = 'TRIAL_GGLE',
    LongTerm = 'LONG_TERM',
    RtdTrial = 'RTD_OFFER',
    Default = 'DEFAULT'
}
