import { createFeatureSelector } from '@ngrx/store';
import { stateIpLocationFeatureKey, StateIpLocationState } from './reducer';

export const getCustomerLocationFeature = createFeatureSelector<StateIpLocationState>(stateIpLocationFeatureKey);
