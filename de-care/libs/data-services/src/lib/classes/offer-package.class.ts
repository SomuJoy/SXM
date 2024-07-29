import { PackageModel, PackageDescriptionModel, OfferDealModel } from '../models/offer.model';
import { PlanTypeEnum } from '../enums/plan-type.enum';
import { QuoteModel } from '../models/quote.model';
import { PackagePlatformEnum, PackagePlanTypeEnum } from '../enums/package.enum';
import { getPlatformFromPackageName } from '../functions/package-helpers';

export class OfferPackage implements PackageModel {
    readonly planCode: string;
    readonly code: string;
    readonly packageName: string;
    readonly termLength: number;
    readonly price: number;
    readonly retailPrice: number;
    readonly type?: PlanTypeEnum;
    readonly description?: PackageDescriptionModel;
    readonly quote?: QuoteModel;
    readonly promoCode?: string;
    readonly fallback: boolean;
    readonly platform: PackagePlatformEnum;
    readonly planType: PackagePlanTypeEnum;
    readonly deal: OfferDealModel;
    readonly priceChangeMessagingType: string;
    readonly isFreeOffer: boolean;
    readonly streaming: boolean;
    readonly advantage?: boolean;

    constructor(packageObject: PackageModel) {
        Object.assign(this, packageObject);
        this.platform = getPlatformFromPackageName(this.packageName);
        this.planType = this.getPlanType();
    }

    _init() {}

    getPlanType(): PackagePlanTypeEnum {
        const packageName = this.packageName;
        const splits = packageName.split('_');
        const planCode = splits[splits.length - 1].toLowerCase();

        switch (planCode) {
            case 'evt':
                return PackagePlanTypeEnum.Select;
            case 'allaccess':
                return PackagePlanTypeEnum.Allaccess;
            case 'mm':
                return PackagePlanTypeEnum.MostlyMusic;
            case 'ff':
                if (splits[splits.length - 2].toLowerCase() === 'allaccess') {
                    return PackagePlanTypeEnum.AllAccessFamilyFriendly;
                }
                return PackagePlanTypeEnum.SelectFamilyFriendly;
            case 'ns':
                return PackagePlanTypeEnum.NewsSportsAndTalk;
            default:
                return PackagePlanTypeEnum.None;
        }
    }
}
