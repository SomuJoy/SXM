import { ZAGInfoModel } from '../data-services/zag-info.interface';

export const featureKey = 'environmentInfoFeature';

export interface ZAGState {
    profileID: ZAGInfoModel | null;
}
