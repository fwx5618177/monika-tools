import { IStrategy } from './IStrategy';

export interface IBacktest {
    runBacktest(strategy: IStrategy, historicalData: any[]): void;
}
