import { createFeatureSelector } from '@ngrx/store';
import { streamingFlepzLookupFeatureKey, StreamingFlepzLookupState } from './reducer';

export const selectStreamingFlepzLookupFeature = createFeatureSelector<StreamingFlepzLookupState>(streamingFlepzLookupFeatureKey);
