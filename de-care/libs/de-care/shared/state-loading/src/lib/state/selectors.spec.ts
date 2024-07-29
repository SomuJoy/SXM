import { LoadingState } from './reducer';
import { selectPageDataIsLoading } from './selectors';

describe('selectors', () => {
    describe('selectPageDataIsLoading', () => {
        it('should return expected pageDataIsLoading boolean from state', () => {
            // arrange
            const inputState = { pageDataLoading: false } as LoadingState;
            const expected = false;

            // act
            const actual = selectPageDataIsLoading.projector(inputState);

            // assert
            expect(actual).toEqual(expected);
        });
    });
});
