import { Mock } from 'ts-mockery';
import { Observable, of } from 'rxjs';
import { DataAccountService, TokenPayload } from '@de-care/data-services';
import { DataLayerService } from '@de-care/data-layer';
import { AccountFromTokenWorkflow } from './account-from-token-workflow.service';
import { Store } from '@ngrx/store';

describe('NonPiiLookupWorkflow', () => {
    let mockDataAccountService: DataAccountService;
    let mockDataLayerService: DataLayerService;
    let mockTokenPayload: TokenPayload;
    beforeEach(() => {
        mockDataAccountService = Mock.of<DataAccountService>({ getFromToken: () => of() });
        mockDataLayerService = Mock.of<DataLayerService>();
        mockTokenPayload = Mock.of<TokenPayload>();
    });
    it('should return an observable when the build method is called', () => {
        const mockStore = Mock.of<Store>({ pipe: () => of({}) });
        const accountFromTokenWorkFlow = new AccountFromTokenWorkflow(mockDataAccountService, mockDataLayerService, mockStore);
        const workflow = accountFromTokenWorkFlow.build(mockTokenPayload);
        expect(workflow).toBeInstanceOf(Observable);
    });
    it('should use the getFromToken data service when the build method is called', () => {
        const mockStore = Mock.of<Store>({ pipe: () => of({}) });
        const accountFromTokenWorkFlow = new AccountFromTokenWorkflow(mockDataAccountService, mockDataLayerService, mockStore);
        accountFromTokenWorkFlow.build(mockTokenPayload);
        expect(mockDataAccountService.getFromToken).toHaveBeenCalled();
    });
});
