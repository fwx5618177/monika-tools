import { IStrategy } from './IStrategy';
import { MovingAverageStrategy } from './MovingAverageStrategy';
import { IStrategyFactory } from './IStrategyFactory';

export class StrategyFactory implements IStrategyFactory {
    createStrategy(type: string): IStrategy {
        switch (type) {
            case 'movingAverage':
                return new MovingAverageStrategy();
            // 这里可以根据需要添加更多策略
            default:
                throw new Error('Unknown strategy type');
        }
    }
}
