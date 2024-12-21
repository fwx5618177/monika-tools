import { IStrategy } from './IStrategy';

export interface IOptimization {
    optimizeStrategy(strategy: IStrategy, optimizationParams: any): IStrategy;
}
