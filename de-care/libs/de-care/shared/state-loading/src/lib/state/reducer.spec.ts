import { Action } from '@ngrx/store';
import { pageDataFinishedLoading, pageDataStartedLoading } from './actions';
import { LoadingState, reducer } from './reducer';

describe('reducer', () => {
    describe('pageDataStartedLoading', () => {
        it('should return expected state', () => {
            // arrange
            const action = pageDataStartedLoading();
            const expected = { pageDataLoading: true } as LoadingState;
            const initialState = { pageDataLoading: false } as LoadingState;

            // act
            const actual = reducer(initialState, action);

            // assert
            expect(actual).toEqual(expected);
        });
    });
    describe('pageDataFinishedLoading', () => {
        it('should return expected state', () => {
            // arrange
            const action = pageDataFinishedLoading();
            const expected = { pageDataLoading: false } as LoadingState;
            const initialState = { pageDataLoading: true } as LoadingState;

            // act
            const actual = reducer(initialState, action);

            // assert
            expect(actual).toEqual(expected);
        });
    });
    describe('Unknown Action', () => {
        it('should return same state', () => {
            // arrange
            const initialState = { pageDataLoading: false } as LoadingState;
            const action = { type: 'UNKNOWN ACTION' } as Action;
            const expected = initialState;

            // act
            const actual = reducer(initialState, action);

            // assert
            expect(actual).toEqual(expected);
        });
    });
});
