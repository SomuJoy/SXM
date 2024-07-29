// ===============================================================================
// Classes
import { DataServiceConfig } from '../abstract/data-service-config.abstract';

//********************************************************************************
export interface DataServicesModuleConfig {
    config?: DataServiceConfig;
    pluralNames?: { [name: string]: string };
}