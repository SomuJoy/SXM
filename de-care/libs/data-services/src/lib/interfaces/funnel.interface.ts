// ===============================================================================
// Internal Features (Funnel)
import { ICmsOffers } from './offers.interface';
import { ICmsPlanPricing } from './plans-pricing.interface';

//********************************************************************************
export interface ICmsPackageComp {
    offers: ICmsOffers;
    pricing: ICmsPlanPricing;
}