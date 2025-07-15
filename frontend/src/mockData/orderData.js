export const mockOrderData = {
    company: 'Samsung',
    orderNumber: '1443566',
    product: 'Galaxy S22',
    vatPercentage: 20,
    vatAmount: 100.00,
    subtotal: 700.00,
    total: 800.00,
    currency: 'USD',
    customerName: 'Aduke Morewa',
    cardLastFour: '3456',
    expiryDate: '09/24'
};

export const mockPaymentMethods = [
    {
        id: 'credit_card',
        name: 'Credit Card',
        icon: 'credit_card'
    },
    {
        id: 'debit_card',
        name: 'Debit Card',
        icon: 'credit_card'
    },
    {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        icon: 'account_balance'
    }
]; 