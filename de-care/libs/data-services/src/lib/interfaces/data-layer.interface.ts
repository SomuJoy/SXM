import { AuthenticationTypeEnum } from '../enums/authentication-type.enum';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';

export interface CustomerInfoData {
    authenticationType: AuthenticationTypeEnum;
    customerType: string;
    transactionType: TransactionTypeEnum;
    transactionId: string;
    firstName: string;
    email: string;
    sessionId: string;
    location: string;
    language: string;
    marketingId: string;
    marketingAcctId: string;
}
