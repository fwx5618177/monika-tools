import Payment from '../models/Payment';

const createPayment = async (paymentData: any) => {
    const payment = new Payment(paymentData);
    return payment.save();
};

const getPaymentById = async (id: string) => {
    return Payment.findById(id);
};

export default {
    createPayment,
    getPaymentById
};
