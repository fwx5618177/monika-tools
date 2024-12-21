import { IBacktest } from './IBacktest';
import { IStrategy } from './IStrategy';

export class SimpleBacktest implements IBacktest {
    runBacktest(strategy: IStrategy, historicalData: any[]): void {
        console.log('Running backtest for strategy...');

        // 示例：计算策略在历史数据上的表现
        historicalData.forEach(data => {
            strategy.analyzeData(data);
        });

        console.log('Backtest completed.');
    }
}
