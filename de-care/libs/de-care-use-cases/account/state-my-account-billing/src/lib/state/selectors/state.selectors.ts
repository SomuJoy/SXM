import { getCurrentLocale } from '@de-care/de-care-use-cases/account/state-my-account';
import { getAllNonPaymentRecords, getPaymentRecords } from '@de-care/domains/account/state-billing-activity';
import { createSelector } from '@ngrx/store';

// Note on terminology.
// When naming data coming from the billing activity domain, it is referred to as "records".
// Once the data is modeled to match the feature, it is referred to as "history"

// The records in the domain are of type "subcription" or "payment", this changes to "billing" and "payment" in the feature

// BILLING
export const getAllNonPaymentRecordsForCurrentLocale = createSelector(getAllNonPaymentRecords, getCurrentLocale, (nonPaymentRecords, currentLocale) =>
    nonPaymentRecords?.filter((record) => record.locale === currentLocale)
);
export const getBillingRecordsByInvoiceSortedByDateAsArray = createSelector(getAllNonPaymentRecordsForCurrentLocale, (billingRecords) => {
    const recordsByInvoicePropertyArray = billingRecords?.reduce((arrayByInvoice, record) => {
        if (record.billNumber) {
            const billNumberEntry = arrayByInvoice.find(({ invoiceNumber }) => invoiceNumber === record.billNumber);
            if (billNumberEntry) {
                billNumberEntry.records.push(record);
            } else {
                arrayByInvoice.push({ datetime: new Date(record.transactionDate).getTime(), invoiceNumber: record.billNumber, hasDetails: true, records: [record] });
            }
        } else {
            // refunds/adjustments do not have bill numbers
            arrayByInvoice.push({
                datetime: new Date(record.transactionDate).getTime(),
                invoiceNumber: record.billNumber,
                description: record.description,
                hasDetails: false,
                records: [record],
            });
        }

        return arrayByInvoice;
    }, []);
    recordsByInvoicePropertyArray.sort((a, b) => b.datetime - a.datetime);
    return recordsByInvoicePropertyArray;
});

// Nest the serviceFor items
export const getBillingRecordsNestedByServiceForAsArray = createSelector(getBillingRecordsByInvoiceSortedByDateAsArray, (billingRecords) =>
    billingRecords?.map((record) => ({
        ...record,
        records: record.records.reduce((arrayByServiceFor, lineItem) => {
            const serviceForItem = arrayByServiceFor.find(({ name }) => name === lineItem.serviceFor);
            if (serviceForItem) {
                serviceForItem.lineItems.push(lineItem);
            } else {
                arrayByServiceFor.push({ name: lineItem.serviceFor, lineItems: [lineItem] });
            }
            return arrayByServiceFor;
        }, []),
    }))
);

// modeling all the billing records into the proper view model for the feature
export const getBillingRecordsModeled = createSelector(getBillingRecordsNestedByServiceForAsArray, (billingRecords) =>
    billingRecords?.map((record) => ({
        ...record,
        records: record.records.map((item) => ({
            ...item,
            startDate: item.lineItems[0].startDate,
            endDate: item.lineItems[0].endDate,
            lineItems: item.lineItems.map(({ amount, description }) => ({
                amount,
                description,
            })),
        })),
        amount: record.records.reduce((totalAmount, item) => totalAmount + item.lineItems.reduce((subtotalAmount, v) => subtotalAmount + v.amount, 0), 0),
    }))
);

// PAYMENT
export const getPaymentRecordsForCurrentLocale = createSelector(getPaymentRecords, getCurrentLocale, (paymentRecords, currentLocale) =>
    paymentRecords?.filter((record) => record.locale === currentLocale)
);
export const getPaymentRecordsModeled = createSelector(getPaymentRecordsForCurrentLocale, (paymentRecords) =>
    paymentRecords
        .map((record) => ({
            datetime: new Date(record.transactionDate).getTime(),
            amount: record.amount,
            description: record.description,
        }))
        .sort((a, b) => b.datetime - a.datetime)
);
