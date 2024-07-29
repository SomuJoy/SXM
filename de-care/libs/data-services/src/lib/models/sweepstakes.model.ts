import { ContestParams } from '../enums/sweeps-contest-params.enum';

export interface SweepstakesModel {
    id?: string;
    officialRulesUrl?: string;
}

export interface SweepstakesActionParams {
    [ContestParams.contestId]: string;
    [ContestParams.contestUrl]: string;
}
