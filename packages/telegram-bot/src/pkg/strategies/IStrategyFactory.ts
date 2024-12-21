import { IStrategy } from './IStrategy';

export interface IStrategyFactory {
    createStrategy(type: string): IStrategy;
}
