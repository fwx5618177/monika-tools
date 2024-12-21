import { IStrategy } from './IStrategy';

export interface IAdjustment {
    adjustStrategy(strategy: IStrategy, adjustmentParams: any): IStrategy;
}
