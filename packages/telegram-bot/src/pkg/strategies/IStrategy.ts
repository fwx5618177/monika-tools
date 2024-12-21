export interface IStrategy {
    analyzeData<T>(data: T): void;
    executeStrategy(): void;
}
