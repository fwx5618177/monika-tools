import { Request, Response } from 'express';
import DataStorageService from '../services/dataStorageService';

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await DataStorageService.createUser(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await DataStorageService.getUserById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
