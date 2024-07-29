import { Mock } from 'ts-mockery';
import { Observable, of } from 'rxjs';
import { AccountDataRequest, DataAccountService, DataDevicesService } from '@de-care/data-services';
import { NonPiiLookupWorkflow } from './non-pii-lookup-workflow.service';
import { Store } from '@ngrx/store';

describe('NonPiiLookupWorkflow', () => {
    let mockDataAccountService: DataAccountService;
    let mockDataDevicesService: DataDevicesService;
    let mockAccountDataRequest: AccountDataRequest;
    let mockStore: Store;
    beforeEach(() => {
        mockDataAccountService = Mock.of<DataAccountService>({ nonPii: () => of() });
        mockDataDevicesService = Mock.of<DataDevicesService>();
        mockAccountDataRequest = Mock.of<AccountDataRequest>();
    });
    it('should return an observable when the build method is called', () => {
        mockStore = Mock.of<Store>({ pipe: () => of({}) });
        const nonPiiLookupWorkflow = new NonPiiLookupWorkflow(mockStore, mockDataAccountService, mockDataDevicesService);
        const workflow = nonPiiLookupWorkflow.build(mockAccountDataRequest);
        expect(workflow).toBeInstanceOf(Observable);
    });
    it('should use the nonPii data service when the build method is called', () => {
        mockStore = Mock.of<Store>({ pipe: () => of({}) });
        const nonPiiLookupWorkflow = new NonPiiLookupWorkflow(mockStore, mockDataAccountService, mockDataDevicesService);
        nonPiiLookupWorkflow.build(mockAccountDataRequest);
        expect(mockDataAccountService.nonPii).toHaveBeenCalled();
    });
});
