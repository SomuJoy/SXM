import { CustomerPersonalInfo } from './customer.models';
import { getCustomerEmail, getCustomerName, getCustomerPersonalInfo } from './customer.selectors';

describe('Customer selectors', () => {
    const mockFeatureInitialState = {
        personalInfo: null,
        studentInfo: null
    } as const;

    const mockCustomerPersonalInfo: CustomerPersonalInfo = {
        firstName: 'abc',
        lastName: 'def',
        email: 'no-reply@siriusxm.com',
        zipCode: '12345'
    } as const;

    describe('Customer info selectors', () => {
        describe('getCustomerPersonalInfo', () => {
            it('should handle null', () => {
                const initialState = mockFeatureInitialState;
                const expected = null;

                const result = getCustomerPersonalInfo.projector(initialState);

                expect(result).toEqual(expected);
            });
        });

        describe('getCustomerName', () => {
            it('should handle null', () => {
                const initialState = null;
                const expected = null;

                const result = getCustomerName.projector(initialState);

                expect(result).toEqual(expected);
            });

            it('should extract name', () => {
                const initialState = mockCustomerPersonalInfo;
                const expected = {
                    firstName: mockCustomerPersonalInfo.firstName,
                    lastName: mockCustomerPersonalInfo.lastName
                };

                const result = getCustomerName.projector(initialState);

                expect(result).toEqual(expected);
            });
        });

        describe('getCustomerEmail', () => {
            it('should handle null', () => {
                const initialState = null;
                const expected = null;

                const result = getCustomerEmail.projector(initialState);

                expect(result).toEqual(expected);
            });

            it('should extract email', () => {
                const initialState = mockCustomerPersonalInfo;
                const expected = mockCustomerPersonalInfo.email;

                const result = getCustomerEmail.projector(initialState);

                expect(result).toEqual(expected);
            });
        });
    });
});
