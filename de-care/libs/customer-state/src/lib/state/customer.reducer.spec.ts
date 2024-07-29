import { setEmail, setFirstName, setLastName } from './customer.actions';
import { customerPersonalReducer, personalInfoInitialState } from './customer.reducer';

describe('customer reducer', () => {
    describe('customerPersonalReducer', () => {
        it('unknown action should return the previous state', () => {
            const action = {} as any;

            const result = customerPersonalReducer(personalInfoInitialState, action);

            expect(result).toBe(personalInfoInitialState);
        });

        it('should set first name for setFirstName', () => {
            const newVal = 'new first name';
            const action = setFirstName({ firstName: newVal });
            const expected = { firstName: newVal };

            const result = customerPersonalReducer(personalInfoInitialState, action);

            expect(result).toEqual(expected);
        });

        it('should set last name for setLastName', () => {
            const newVal = 'new last name';
            const action = setLastName({ lastName: newVal });
            const expected = { lastName: newVal };

            const result = customerPersonalReducer(personalInfoInitialState, action);

            expect(result).toEqual(expected);
        });

        it('should set email for setEmail', () => {
            const newVal = 'new email';
            const action = setEmail({ email: newVal });
            const expected = { email: newVal };

            const result = customerPersonalReducer(personalInfoInitialState, action);

            expect(result).toEqual(expected);
        });
    });
});
