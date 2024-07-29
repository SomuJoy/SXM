import { createSelector } from '@ngrx/store';
import { selectFeature } from './reducer';

export const getVehicleInfo = createSelector(selectFeature, state => state.vehicle);
