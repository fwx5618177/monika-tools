import EventEmitter from 'events';

export class EventBus extends EventEmitter {
    private static instance: EventBus;

    private constructor() {
        super();
    }

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }

        return EventBus.instance;
    }

    /**
     * 事件发射
     * @param {String} eventName - 事件名
     * @param {Object} payload - 携带的数据
     */
    emitEvent<T>(eventName: string, payload: T) {
        this.emit(eventName, payload);
    }

    /**
     * 事件监听
     * @param {String} eventName - 事件名
     * @param {EventListener} listener - 监听器函数
     */
    onEvent(eventName: string, listener: EventListener) {
        this.on(eventName, listener);
    }

    /**
     * 移除事件监听
     * @param {string} eventName - 事件名
     * @param {EventListener} listener - 监听器函数
     */
    offEvent(eventName: string, listener: EventListener) {
        this.off(eventName, listener);
    }
}
