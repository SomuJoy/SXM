import { Store } from '@ngrx/store';
import { Mock } from 'ts-mockery';
import { OemFlowStateService } from './oem-flow-state.service';
import { hot } from 'jasmine-marbles';
import { of } from 'rxjs';

describe('OemFlowStateService', () => {
    const mockStore = Mock.of<Store>({ pipe: () => of({}), select: () => of({}) });
    describe('Method: init()', () => {
        it('should not call updateStateData if offer is null', () => {
            const ActivatedRouteStub = {};
            const RouterStub = { navigate: jest.fn() };
            const TitleStub = { setTitle: jest.fn() };
            const LoadQuoteWorkflowServiceStub = {};
            const DataLayerServiceStub = {};
            const service = new OemFlowStateService(
                ActivatedRouteStub as any,
                RouterStub as any,
                TitleStub as any,
                DataLayerServiceStub as any,
                mockStore,
                LoadQuoteWorkflowServiceStub as any
            );

            const mockUpdateStateData = jest.fn();
            const mock = jest.spyOn(service, 'updateStateData').mockImplementation(() => {
                return { updateStateData: mockUpdateStateData };
            });
            service.updateStateData({ selectedOffer: null });
            service.init();
            expect(mock).toHaveBeenCalledTimes(1);
        });
        it('should not call updateStateData if radioIdLastFour$ does not return a value', (done) => {
            const ActivatedRouteStub = {};
            const RouterStub = { navigate: jest.fn() };
            const TitleStub = { setTitle: jest.fn() };
            const LoadQuoteWorkflowServiceStub = {};
            const DataLayerServiceStub = {};
            const service = new OemFlowStateService(
                ActivatedRouteStub as any,
                RouterStub as any,
                TitleStub as any,
                DataLayerServiceStub as any,
                mockStore,
                LoadQuoteWorkflowServiceStub as any
            );
            const mockUpdateStateData = jest.fn();
            const mock = jest.spyOn(service, 'updateStateData').mockImplementation(() => {
                return { updateStateData: mockUpdateStateData };
            });
            service.updateStateData({ selectedOffer: {} });
            service.updateStateData({ radioIdLastFour: null });
            of(service.init()).subscribe((value) => {
                expect(mock).toHaveBeenCalledTimes(2);
                done();
            });
        });
    });

    describe('Method: updateStateData()', () => {
        const validAddress = {
            addressLine1: '123 Test Rd',
            city: 'FakePlace',
            state: 'CO',
            zipcode: '12345',
            email: 'faker@test.com',
        };
        const invalidAddress = {
            city: 'FakePlace',
            state: 'CO',
            zipcode: '12345',
        };
        const validFakeOffer = {
            planCode: 'test planCode',
            code: 'test code',
            packageName: 'test packageName',
            termLength: 1,
            price: 12,
            retailPrice: 123,
            deal: {
                type: 'test type',
                etfAmount: 1,
                etfTerm: 12,
                channels: [],
                description: 'test description',
                header: 'test header',
                name: 'test name',
                packageName: 'test packageName',
                promoFooter: 'test promoFooter',
            },
            fallback: false,
            displayPriceChangeMessage: false,
        };

        const validPaymentInfo = {
            nameOnCard: 'test name',
            cardNumber: 1234,
            expiryMonth: '12',
            expiryYear: '2020',
        };

        const validQuote = {
            grandTotalAmmount: 1,
            grandTotalTaxAmount: 12,
            currentQuote: {},
            renewalQuote: {},
            proRatedRenewalQuote: {},
            futureQuote: {},
            fees: [{}],
            taxes: [{}],
            totalTaxesAndFeesAmount: 13,
        };

        describe.each`
            property                    | input1                             | input2            | expected1 | expected2                          | expected3
            ${'account'}                | ${{ hasEmailAddressOnFile: true }} | ${{}}             | ${null}   | ${{ hasEmailAddressOnFile: true }} | ${{}}
            ${'billingAddress'}         | ${validAddress}                    | ${invalidAddress} | ${null}   | ${validAddress}                    | ${invalidAddress}
            ${'hasActiveSubscription'}  | ${true}                            | ${false}          | ${false}  | ${true}                            | ${false}
            ${'isClosedRadio'}          | ${true}                            | ${false}          | ${false}  | ${true}                            | ${false}
            ${'paymentInfo'}            | ${validPaymentInfo}                | ${{}}             | ${null}   | ${validPaymentInfo}                | ${{}}
            ${'programCode'}            | ${'Test Program Code'}             | ${''}             | ${null}   | ${'Test Program Code'}             | ${''}
            ${'quote'}                  | ${validQuote}                      | ${{}}             | ${null}   | ${validQuote}                      | ${{}}
            ${'radioIdLastFour'}        | ${'1234'}                          | ${''}             | ${null}   | ${'1234'}                          | ${''}
            ${'selectedOffer'}          | ${validFakeOffer}                  | ${{}}             | ${null}   | ${validFakeOffer}                  | ${{}}
            ${'submitPaymentInfoError'} | ${true}                            | ${false}          | ${false}  | ${true}                            | ${false}
        `('When: data is $property', ({ property, input1, input2, expected1, expected2, expected3 }) => {
            it(`should update the store property ${property}`, () => {
                const ActivatedRouteStub = {};
                const RouterStub = { navigate: jest.fn() };
                const TitleStub = { setTitle: jest.fn() };
                const LoadQuoteWorkflowServiceStub = {};
                const DataLayerServiceStub = {};
                const service = new OemFlowStateService(
                    ActivatedRouteStub as any,
                    RouterStub as any,
                    TitleStub as any,
                    DataLayerServiceStub as any,
                    mockStore,
                    LoadQuoteWorkflowServiceStub as any
                );
                service.updateStateData({ [property]: input1 });

                expect(service[property + '$']).toBeObservable(hot('a', { a: input1 }));
            });
            it(`should only cause ${property}$ to emit when change is distinct`, () => {
                const ActivatedRouteStub = {};
                const RouterStub = { navigate: jest.fn() };
                const TitleStub = { setTitle: jest.fn() };
                const LoadQuoteWorkflowServiceStub = {};
                const DataLayerServiceStub = {};
                const service = new OemFlowStateService(
                    ActivatedRouteStub as any,
                    RouterStub as any,
                    TitleStub as any,
                    DataLayerServiceStub as any,
                    mockStore,
                    LoadQuoteWorkflowServiceStub as any
                );

                service.updateStateData({ [property]: input1 });
                expect(service[property + '$']).toBeObservable(hot('a', { a: expected2 }));
                service.updateStateData({ [property]: input1 });
                expect(service[property + '$']);
                service.updateStateData({ [property]: input2 });
                expect(service[property + '$']).toBeObservable(hot('a', { a: expected3 }));
            });
        });
    });
});
