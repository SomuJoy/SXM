export interface EnvironmentInfoModel {
    mode: string;
    country: string;
    buildInfo: EnvironmentBuildInfoModel;
    sessionInfo: EnvironmentSessionInfoModel;
}

export interface EnvironmentBuildInfoModel {
    tag: string;
    smsDependency: string;
    smsUser: string;
    smsHost: string;
    pvtTime: string;
}

export interface EnvironmentSessionInfoModel {
    id: string;
    idleTimeout: string;
    absoluteTimeout: string;
}
