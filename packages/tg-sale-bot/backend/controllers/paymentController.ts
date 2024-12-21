import { Request, Response } from 'express';
import PaymentService from '../services/paymentService';

export const createPayment = async (req: Request, res: Response) => {
    try {
        const payment = await PaymentService.createPayment(req.body);
        res.status(201).json(payment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getPayment = async (req: Request, res: Response) => {
    try {
        const payment = await PaymentService.getPaymentById(req.params.id);
        if (payment) {
            res.status(200).json(payment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
