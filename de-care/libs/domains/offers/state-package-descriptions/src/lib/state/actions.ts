import { createAction, props } from '@ngrx/store';
import { PackageDescriptionModel, locales } from './models';

export const setCurrentLocale = createAction('[Package Descriptions] Set current locale', props<{ locale: locales }>());
export const setPackageDescriptions = createAction('[Package Descriptions] Set package descriptions', props<{ packageDescriptions: PackageDescriptionModel[] }>());
