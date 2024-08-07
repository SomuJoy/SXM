export interface ListenOn {
    insideTheCar: boolean;
    outsideTheCar: boolean;
    pandoraStations: boolean;
    vip: boolean;
}

interface ListenOnForPackages {
    [packageName: string]: ListenOn;
}

// TODO: Needs refactoring. This data should come from all the package descriptions. Component should not be responsible for looking data up.
// Must only be considered as part to the component view model data.
export const LISTEN_ON_DATA: ListenOnForPackages = {
    SIR_CHOICE_GENERIC: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    '1_SIR_CHOICE_GENERIC': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SXM_SIR_CHOICE_GENERIC: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SIR_CHOICE: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    XM_CHOICE: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SXM_CHOICE: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SIR_EVT_LT: {
        insideTheCar: true,
        outsideTheCar: false,
        pandoraStations: false,
        vip: false,
    },
    SIR_EVT: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SIR_FF: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SIR_ALLACCESS: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: true,
        vip: false,
    },
    SIR_ALLACCESS_FF: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: true,
        vip: false,
    },
    '1_SIR_EVT_LT': {
        insideTheCar: true,
        outsideTheCar: false,
        pandoraStations: false,
        vip: false,
    },
    '1_SIR_EVT': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    '1_SIR_FF': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    '1_SIR_ALLACCESS': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: true,
        vip: false,
    },
    '1_SIR_ALLACCESS_FF': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: true,
        vip: false,
    },
    '3_SIR_EVT_LT': {
        insideTheCar: true,
        outsideTheCar: false,
        pandoraStations: false,
        vip: false,
    },
    '3_SIR_EVT': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    '3_SIR_FF': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    '3_SIR_ALLACCESS': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: true,
        vip: false,
    },
    '3_SIR_ALLACCESS_FF': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: true,
        vip: false,
    },
    SXM_SIR_EVT_LT: {
        insideTheCar: true,
        outsideTheCar: false,
        pandoraStations: false,
        vip: false,
    },
    SXM_SIR_EVT: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SXM_SIR_FF: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SXM_SIR_ALLACCESS: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: true,
        vip: false,
    },
    SXM_SIR_ALLACCESS_FF: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: true,
        vip: false,
    },
    '1_SXM_SIR_EVT': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    '1_SXM_SIR_ALLACCESS': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: true,
        vip: false,
    },
    SIR_PKG_MM: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    '1_SIR_PKG_MM': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SXM_SIR_PKG_MM: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SIR_PKG_NS: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    '1_SIR_PKG_NS': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SXM_SIR_PKG_NS: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    '1_SIR_MM': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SXM_SIR_MM: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SIR_MM: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SIR_IP_SA_ESNTL: {
        insideTheCar: false,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SIR_IP_SA: {
        insideTheCar: false,
        outsideTheCar: true,
        pandoraStations: true,
        vip: false,
    },
    SIR_IP_CHOICE_GENERIC: {
        insideTheCar: false,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SIR_VIP: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: true,
    },
    SXM_SIR_VIP: {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: true,
    },
    '1_SIR_VIP': {
        insideTheCar: true,
        outsideTheCar: true,
        pandoraStations: false,
        vip: true,
    },
    SIR_IP_SHOWCASE: {
        insideTheCar: false,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
    SIR_CAN_IP_SHOWCASE: {
        insideTheCar: false,
        outsideTheCar: true,
        pandoraStations: false,
        vip: false,
    },
};

export function getNormalizedPackageName(packageName: string): string {
    return packageName.replace(/(_AUD_|_CAN_)/, '_');
}

export function mapPackageNameToListenOn(packageName: string): ListenOn {
    return LISTEN_ON_DATA[getNormalizedPackageName(packageName)] || <ListenOn>{ insideTheCar: false, outsideTheCar: false, pandoraStations: false };
}

export const CURRENCY_PIPE_OPTIONAL_DECIMAL_NUMBER_FORMAT = '1.0-2';
export const CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT = '1.2-2';
