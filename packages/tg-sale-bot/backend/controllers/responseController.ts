import { Request, Response } from 'express';
import ResponseService from '../services/responseService';

export const createResponse = async (req: Request, res: Response) => {
    try {
        const response = await ResponseService.createResponse(req.body);
        res.status(201).json(response);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getResponse = async (req: Request, res: Response) => {
    try {
        const response = await ResponseService.getResponseById(req.params.id);
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ message: 'Response not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
