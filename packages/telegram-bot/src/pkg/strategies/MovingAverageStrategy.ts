import { IStrategy } from './IStrategy';

export class MovingAverageStrategy implements IStrategy {
    analyzeData<T>(data: T): void {
        // 在这里实现数据分析逻辑
        console.log('Analyzing data with Moving Average Strategy...');
        console.log('Data:', data);
    }

    executeStrategy(): void {
        // 在这里实现策略的执行逻辑
        console.log('Executing Moving Average Strategy...');
    }
}
