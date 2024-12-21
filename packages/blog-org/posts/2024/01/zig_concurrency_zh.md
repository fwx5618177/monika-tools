---
title: 【Zig】并发的实现方法
author: fwx
language: 中文
tags:
  - Zig
  - 并发
  - 多线程传递数据
description: >-
  主要对zig自带的几个方法进行介绍 - Mutex, Condition, Semaphore, WaitGroup, Event.Channel。由于Zig的Channel目前尚未生效，所以我们基于Mutex做一个最基础的Channel和Select。
excerpt: Zig的并发实现方法。主要通过mutex来实现。
addition:
  - 中文
  - Zig
type:
  - 文章
  - 介绍
isSticky: true
id: 7aa0a83c-50b9-4bef-b8d0-2215e6c0210f
slug: 871ec5c06015183574cedba9cdfbe5
---

# 【Zig】并发的实现方法

## 共享内存

```zig
const std = @import("std");
const Thread = std.Thread;
const Mutex = Thread.Mutex;
const spawn = Thread.spawn;
const SpawnConfig = Thread.SpawnConfig;

const SharedData = struct {
    mutex: Mutex,
    value: i32,

    const Self = @This();

    pub fn updateValue(self: *Self, increment: i32, max_iterations: usize) void {
        self.mutex.lock();
        defer self.mutex.unlock();

        for (0..max_iterations) |_| {
            self.value += increment;
        }

        std.debug.print("Thread {} updated value to {}\n", .{ Thread.getCurrentId(), self.value });
    }

    // tryUpdateValue attempts to update the value, but returns false if it can't
    pub fn tryUpdateValue(self: *Self, increment: i32, max_iterations: usize) bool {
        if (!self.mutex.tryLock()) {
            return false; // if we can't lock the mutex, return false
        }

        defer self.mutex.unlock();

        for (0..max_iterations) |_| {
            self.value += increment;
        }

        // while loop
        // var start_index: usize = 0;
        // while (start_index < max_iterations) : (start_index += 1) {
        //     self.value += increment;
        // }

        return true;
    }
};

// 1. pass data by multiple arguments
fn threadFuncMultipleArgs(shared_data: *SharedData, increment: i32, max_iterations: usize) void {
    // Get current thread id
    std.debug.print("Thread {} locked mutex, current value is: {}\n", .{ Thread.getCurrentId(), shared_data.value });

    shared_data.updateValue(increment, max_iterations);
}

// 2. pass data by a single struct argument
const ThreadFuncArgs = struct {
    shared_data: *SharedData,
    increment: i32,
    max_iterations: usize,
};

fn threadFunc(args: ThreadFuncArgs) void {
    // Get current thread id
    std.debug.print("Thread {} locked mutex, current value is: {}\n", .{ Thread.getCurrentId(), args.shared_data.value });

    args.shared_data.updateValue(args.increment, args.max_iterations);
}

pub fn main() !void {
    const threadConfig = SpawnConfig{
        .stack_size = 1024 * 16,
    };

    var shared_data = SharedData{
        .mutex = Mutex{},
        .value = 0,
    };

    const threadArgs1 = ThreadFuncArgs{
        .shared_data = &shared_data,
        .increment = 1,
        .max_iterations = 1000,
    };

    const threadArgs2 = ThreadFuncArgs{
        .shared_data = &shared_data,
        .increment = 3,
        .max_iterations = 1000,
    };

    const thread1 = try spawn(threadConfig, threadFunc, .{
        threadArgs1,
    });

    const thread2 = try spawn(threadConfig, threadFunc, .{threadArgs2});

    thread1.join();
    thread2.join();

    std.debug.print("Final value: {}\n", .{shared_data.value});
}

test "test threadFunc updates shared data correctly" {
    var shared_data = SharedData{
        .mutex = Mutex{},
        .value = 0,
    };

    const thread = try spawn(.{}, threadFuncMultipleArgs, .{
        &shared_data,
        1,
        50,
    });

    thread.join();

    try std.testing.expectEqual(shared_data.value, 50);
}
```

此代码示例展示了如何在 Zig 语言中使用多线程和互斥锁（Mutex）来安全地更新共享数据。这是并发编程中一个常见的场景，特别是当多个线程需要读取和修改同一数据时。

#### 代码概览

1. **引入标准库**：使用 `@import("std")` 引入 Zig 的标准库。
2. **定义互斥锁和线程相关功能**：使用 `Thread` 模块中的 `Mutex`、`spawn` 和 `SpawnConfig`。
3. **定义共享数据结构**（`SharedData`）：
   - 包含一个 `Mutex` 和一个整型值 `value`。
   - 提供两个方法 `updateValue` 和 `tryUpdateValue` 来更新 `value`。

#### 具体代码分析

- `SharedData` 结构体：

  - **互斥锁（Mutex）**：用于控制对 `value` 的访问，确保一次只有一个线程可以修改它。
  - **`updateValue` 方法**：锁定互斥锁，然后增加 `value`，最后解锁。使用 `defer` 语句确保即使出现错误也会释放锁。
  - **`tryUpdateValue` 方法**：尝试锁定互斥锁，如果成功则更新 `value`，否则返回 `false`。

- **线程函数**：

  - `threadFuncMultipleArgs` 和 `threadFunc`：这两个函数展示了如何传递参数给线程。它们接收 `SharedData` 实例，并调用 `updateValue` 方法。

- **主函数（`main`）**：

  - 初始化共享数据和线程配置。
  - 创建两个线程，每个线程都调用 `threadFunc` 并传入不同的参数。
  - 等待线程完成，然后打印最终的 `value` 值。

- **测试用例**：
  - 展示了如何测试 `SharedData` 的 `updateValue` 方法。

## 条件变量和互斥锁

```zig
const std = @import("std");
const Thread = std.Thread;
const Mutex = Thread.Mutex;
const spawn = Thread.spawn;
const SpawnConfig = Thread.SpawnConfig;

var mutex = Mutex{};
var cond = Thread.Condition{};
var ready = false;

fn worker() void {
    mutex.lock();
    defer mutex.unlock();
    std.debug.print("Worker: {} lock, checking ready status...\n", .{Thread.getCurrentId()});

    while (!ready) {
        std.debug.print("Worker: Ready is false, waiting on condition...\n", .{});
        cond.wait(&mutex);
    }

    std.debug.print("Worker: Ready is true, proceeding...\n", .{});
    std.debug.print("Worker: Released lock, exiting...\n", .{});
}

pub fn main() !void {
    std.debug.print("Main: Spawning worker thread...\n", .{});

    const thread = spawn(.{}, worker, .{}) catch unreachable;

    std.debug.print("Main: Sleeping for 1 second...\n", .{});
    std.time.sleep(1 * std.time.ns_per_s);

    {
        mutex.lock();
        defer mutex.unlock();
        std.debug.print("Main: mutex lock, setting ready to true...\n", .{});

        ready = true;
        cond.signal();

        std.debug.print("Main: Released lock, signalled condition...\n", .{});
    }

    thread.join();

    std.debug.print("Main: Worker thread joined, exiting main...\n", .{});
}
```

这段 Zig 代码是一个展示条件变量（Condition Variable）和互斥锁（Mutex）用法的很好的例子。在并发编程中，条件变量用于线程之间的同步，特别是当某些条件发生变化时。以下是对代码的详细解释。

#### 代码概览

1. **引入标准库**：使用 `@import("std")` 引入 Zig 的标准库。
2. **定义互斥锁和条件变量**：使用 `Thread` 模块中的 `Mutex` 和 `Condition`。
3. **定义全局变量**：`mutex` 用于同步对共享资源的访问，`cond` 是条件变量，`ready` 是一个布尔变量表示特定条件是否满足。

#### 具体代码分析

- **工作线程函数 `worker`**：

  - 获取互斥锁。
  - 使用 `while` 循环检查 `ready` 变量的状态。如果 `ready` 为 `false`，线程将在条件变量 `cond` 上等待。
  - 当 `ready` 变为 `true`，线程继续执行并释放锁。

- **主函数（`main`）**：
  - 启动工作线程。
  - 主线程休眠一秒钟，模拟一些处理过程。
  - 获取互斥锁，将 `ready` 设置为 `true` 并通过条件变量 `cond` 发送信号，唤醒等待的线程。
  - 释放互斥锁，等待工作线程完成。

#### 关键点

- **条件变量（Condition Variable）**：条件变量用于线程间的同步。当某个条件（本例中的 `ready` 变量）发生变化时，一个线程可以通知其他线程。

## Semaphore 信号量和互斥锁

```zig
const std = @import("std");
const Thread = std.Thread;
const Mutex = Thread.Mutex;
const spawn = Thread.spawn;
const SpawnConfig = Thread.SpawnConfig;

var semaphore: Thread.Semaphore = .{
    .permits = 1,
};

fn threadFunc(value: usize) void {
    std.debug.print("thread {}: starting\n", .{Thread.getCurrentId()});

    for (0..5) |_| {
        std.debug.print("Wait for semaphore\n", .{});
        semaphore.wait();
        std.debug.print("thread {}: semaphore permits before increment: {}\n", .{ Thread.getCurrentId(), semaphore.permits });

        semaphore.permits += value;
        std.debug.print("thread {}: semaphore permits after increment: {}\n", .{ Thread.getCurrentId(), semaphore.permits });
        semaphore.post();
        std.time.sleep(1 * std.time.ns_per_s);
    }
}

pub fn main() !void {
    const testNum: usize = 10;

    std.debug.print("Initial shared data value: {}\n", .{semaphore.permits});
    const thread1 = try std.Thread.spawn(.{}, threadFunc, .{testNum});
    const thread2 = try std.Thread.spawn(.{}, threadFunc, .{testNum});

    thread1.join();
    thread2.join();

    std.debug.print("Final shared data value: {}\n", .{semaphore.permits});
}
```

#### 代码概览

1. **引入标准库**：使用 `@import("std")` 引入 Zig 的标准库。
2. **定义信号量**：创建一个 `Thread.Semaphore` 类型的全局变量 `semaphore`，用于控制资源的访问。
3. **初始化信号量**：信号量初始化为 1，这意味着在任何时候只允许一个线程修改它。

#### 具体代码分析

- **线程函数 `threadFunc`**：

  - 打印线程启动的消息。
  - 在一个循环中使用信号量进行同步：
    - 线程通过调用 `semaphore.wait()` 请求访问资源。如果信号量的值为 0，则线程将等待，直到信号量的值增加。
    - 线程增加信号量的值（模拟对共享资源的修改）。
    - 线程打印信号量修改前后的值。
    - 线程通过调用 `semaphore.post()` 释放信号量，允许其他线程访问资源。
    - 线程休眠一秒钟，模拟执行时间。

- **主函数（`main`）**：
  - 打印初始的信号量值。
  - 创建并启动两个线程，每个线程运行 `threadFunc` 函数。
  - 等待两个线程完成。
  - 打印最终的信号量值。

#### 关键点

- **信号量（Semaphore）**：信号量是一种同步机制，用于控制对共享资源的访问。在本例中，信号量用于确保在任何给定时间只有一个线程可以修改信号量的值。
- **等待和发布（Wait and Post）**：信号量的 `wait()` 方法用于请求访问资源，而 `post()` 方法用于释放资源。
- **线程间的同步**：通过使用信号量，线程在修改共享资源（在此例中为信号量的 `permits` 字段）之前必须等待其他线程释放资源。

## 使用等待组同步线程

```zig
const std = @import("std");
const Thread = std.Thread;
const WaitGroup = Thread.WaitGroup;
const spawn = Thread.spawn;

const SharedData = struct {
    value: i32,
};

var shared_data = SharedData{ .value = 0 };

pub fn threadFunc(wg: *WaitGroup, increment: usize) void {
    std.debug.print("Thread started with increment: {}\n", .{increment});

    for (0..100) |_| {
        shared_data.value += @intCast(increment);
    }

    wg.finish();
    std.debug.print("Thread finished with increment: {}\n", .{increment});
}

pub fn main() !void {
    var wg = WaitGroup{};
    wg.reset();

    const num_threads = 4;
    var threads: [num_threads]Thread = undefined;

    for (threads[0..], 0..num_threads) |*t, index| {
        wg.start();
        std.debug.print("Starting thread {}\n", .{index});

        t.* = try spawn(.{}, threadFunc, .{
            &wg, index * 10,
        });
    }

    wg.wait();
    std.debug.print("All threads have started, waiting for completion\n", .{});

    for (threads[0..], 0..num_threads) |*t, index| {
        t.join();
        std.debug.print("Joined thread {}\n", .{index});
    }

    std.debug.print("Finally shared_data value is {}\n", .{shared_data.value});
}

```

#### 代码概览

1. **引入标准库**：使用 `@import("std")` 引入 Zig 的标准库。
2. **定义共享数据结构**（`SharedData`）：一个简单的结构体，包含一个整型值 `value`。
3. **初始化共享数据**：创建一个 `SharedData` 实例 `shared_data`，其 `value` 初始化为 0。

#### 具体代码分析

- **线程函数 `threadFunc`**：

  - 打印线程启动的消息，并显示线程的增量值。
  - 在一个循环中增加 `shared_data.value` 的值。
  - 调用 `wg.finish()` 表示线程已完成其工作。
  - 打印线程结束的消息。

- **主函数（`main`）**：
  - 初始化等待组 `WaitGroup`。
  - 创建一个线程数组 `threads`。
  - 在一个循环中，对每个线程：
    - 调用 `wg.start()` 表示新线程的开始。
    - 使用 `spawn` 创建线程，执行 `threadFunc`。
  - 调用 `wg.wait()` 等待所有线程完成。
  - 加入（`join`）所有线程，确保它们都已结束。
  - 打印最终的 `shared_data.value` 值。

#### 关键点

- **等待组（WaitGroup）**：等待组用于跟踪和等待一组线程的完成。当一个新线程启动时，调用 `wg.start()`；当线程结束时，调用 `wg.finish()`。
- **共享数据的访问**：示例中的所有线程共享 `shared_data` 实例。每个线程都修改 `shared_data.value` 的值。
- **线程的创建和管理**：使用 `spawn` 函数创建并启动线程，使用 `join` 方法等待线程完成。
- **并发数据访问的考虑**：此代码示例为了简化并未使用锁或其他同步机制来保护共享数据。在实际应用中，如果有多个线程同时修改同一数据，应使用互斥锁或原子操作来避免竞态条件。

这种模式使得管理线程的生命周期变得更加简单，特别是当需要等待多个线程完成其工作时。然而，需要注意的是，在处理共享数据时，要确保线程安全，避免出现数据竞争的问题。

## 自定义通道和并发编程

```zig
const std = @import("std");
const Thread = std.Thread;
const Event = std.event;
// const Channel = Event.Channel; // TODO: After Publish Async to make this work
const Mutex = Thread.Mutex;
const Condition = Thread.Condition;
const spawn = Thread.spawn;

const SelectOp = enum {
    Send,
    Recv,
};

const SelectCase = struct {
    op: SelectOp,
    channel: *Channel(i32),
    value: ?i32,
    is_ready: bool,
};

pub fn Channel(comptime T: type) type {
    return struct {
        mutex: Mutex,
        not_empty: Condition,
        not_full: Condition,
        buffer: []i32,
        start: usize,
        end: usize,
        count: usize,
        closed: bool,
        select_cases: std.ArrayList(*SelectCase), // support select usage

        const Self = @This();

        pub fn init(self: *Self, buffer: []T) void {
            self.* = Self{
                .mutex = Mutex{},
                .not_empty = Condition{},
                .not_full = Condition{},
                .buffer = buffer,
                .start = 0,
                .end = 0,
                .count = 0,
                .closed = false,
                .select_cases = std.ArrayList(*SelectCase).init(std.heap.page_allocator),
            };
        }

        pub fn deinit(self: *Self) void {
            self.mutex.lock();
            defer self.mutex.unlock();

            self.not_empty.broadcast();
            self.not_full.broadcast();
            self.closed = true;
            self.buffer = undefined;
            self.start = 0;
            self.end = 0;
            self.count = 0;
        }

        pub fn put(self: *Self, item: T) void {
            self.mutex.lock();
            defer self.mutex.unlock();

            while (self.count == self.buffer.len) {
                self.not_full.wait(&self.mutex);
            }

            self.buffer[self.end] = item;
            self.end = (self.end + 1) % self.buffer.len;
            self.count += 1;
            self.not_empty.signal();
        }

        pub fn get(self: *Self) T {
            self.mutex.lock();
            defer self.mutex.unlock();

            while (self.count == 0) {
                self.not_empty.wait(&self.mutex);
            }
            const item = self.buffer[self.start];
            self.start = (self.start + 1) % self.buffer.len;
            self.count -= 1;
            self.not_full.signal();

            return item;
        }

        pub fn send_nb(self: *Self, item: T) bool {
            self.mutex.lock();
            defer self.mutex.unlock();

            if (self.count == self.buffer.len) {
                return false; // buffer is full
            }

            self.buffer[self.end] = item;
            self.end = (self.end + 1) % self.buffer.len;
            self.count += 1;
            self.not_empty.signal();

            return true;
        }

        pub fn recv_nb(self: *Self) ?T {
            self.mutex.lock();
            defer self.mutex.unlock();

            if (self.count == 0) {
                return null; // buffer is empty
            }

            const item = self.buffer[self.start];
            self.start = (self.start + 1) % self.buffer.len;
            self.count -= 1;
            self.not_full.signal();

            return item;
        }

        pub fn registerSelectCase(self: *Self, case: *SelectCase) !void {
            self.mutex.lock();
            defer self.mutex.unlock();

            try self.select_cases.append(case);
        }

        pub fn trySelectOperation(self: *Self) bool {
            for (self.select_cases.items) |case| {
                switch (case.op) {
                    .Send => {
                        if (case.value != null and self.send_nb(case.value.?)) {
                            return true;
                        }
                    },
                    .Recv => {
                        if (self.recv_nb()) |item| {
                            case.value = item;
                            case.is_ready = true;

                            return true;
                        } else {
                            continue;
                        }
                    },
                }
            }

            return false;
        }
    };
}

pub fn select(cases: []SelectCase) !void {
    var done = false;

    // 1. register all cases
    for (cases) |*case| try case.channel.registerSelectCase(case);

    // 2. execution
    while (!done) {
        for (cases) |*case| {
            if (case.channel.trySelectOperation()) {
                case.is_ready = true;
                done = true;

                if (case.op == .Recv) {
                    std.debug.print("Received value: {?}\n", .{case.value});
                }

                break;
            }
        }
    }

    // 3. clean up
    for (cases) |*case| {
        var i: usize = 0;

        while (i < case.channel.select_cases.items.len) {
            if (case.channel.select_cases.items[i] == case) {
                _ = case.channel.select_cases.swapRemove(i);
            } else {
                i += 1;
            }
        }
    }
}

fn producer(ch: anytype) void {
    std.debug.print("Producer starting...\n", .{});

    for (0..5) |i| {
        std.debug.print("Sending: {}\n", .{i});
        ch.put(@intCast(i));
        std.debug.print("Sent: {}\n", .{i});
    }
}

fn consumer(ch: anytype) void {
    for (0..5) |_| {
        const v = ch.get();
        std.debug.print("Received: {}\n", .{v});
    }
}

pub fn blockChannel() !void {
    var channel: Channel(i32) = undefined;
    var buffer: [5]i32 = undefined;

    channel.init(buffer[0..]);
    defer channel.deinit();

    std.debug.print("Channel initialized\n", .{});
    std.debug.print("Start two threads..\n", .{});
    // start the producer and consumer threads
    const producerThread = try spawn(.{}, producer, .{&channel});
    const consumerThread = try spawn(.{}, consumer, .{&channel});

    // wait for the threads to finish
    producerThread.join();
    consumerThread.join();

    std.debug.print("Done!\n", .{});
}

pub fn selectChannelData(channel: *Channel(i32)) !void {
    // select
    var cases: [2]SelectCase = undefined;
    var select_count: usize = 0;
    var attemptsTrack: usize = 0;

    while (attemptsTrack < 2) {
        if (channel.count < channel.buffer.len) {
            cases[0] = SelectCase{
                .op = .Send,
                .channel = channel,
                .value = 200,
                .is_ready = false,
            };

            select_count += 1;
        }

        cases[1] = SelectCase{
            .op = .Recv,
            .channel = channel,
            .value = null,
            .is_ready = false,
        };
        select_count += 1;

        try select(cases[0..]);

        for (cases) |case| {
            if (case.is_ready) {
                switch (case.op) {
                    .Send => {
                        const sent = channel.send_nb(100);
                        if (sent) {
                            std.debug.print("{} Send value: {}\n", .{ Thread.getCurrentId(), case.value.? });
                        } else {
                            std.debug.print("{} Send failed, channel is full.\n", .{Thread.getCurrentId()});
                        }
                    },
                    .Recv => {
                        const received = channel.recv_nb();
                        if (received != null) {
                            std.debug.print("{} Received value: {?}\n", .{ Thread.getCurrentId(), received });
                        } else {
                            std.debug.print("Receive failed, channel is empty.\n", .{});
                        }
                    },
                }

                attemptsTrack += 1;
            }
        }

        select_count = 0;
    }
}

pub fn nonBlockingChannel() !void {
    var channel: Channel(i32) = undefined;
    var buffer: [10]i32 = undefined;

    channel.init(buffer[0..]);
    defer channel.deinit();

    const threadCount = 10;

    for (threadCount) |_| {
        const thread = try spawn(.{}, selectChannelData, .{
            &channel,
        });
        thread.join();
    }
}

pub fn main() !void {
    try blockChannel();
    try nonBlockingChannel();
}
```

这段 Zig 代码实现了一个自定义的通道（Channel）类型，展示了如何使用通道进行线程间的数据传输和同步。这是一个高级的并发编程示例，涉及到信号量、互斥锁、条件变量以及选择操作（Select Operation）。

#### 代码概览

1. **引入标准库**：使用 `@import("std")` 引入 Zig 的标准库。
2. **定义自定义通道类型**：实现了一个名为 `Channel` 的泛型结构体，用于线程间的消息传递。
3. **实现通道的基本操作**：包括 `put`、`get`、`send_nb`（非阻塞发送）、`recv_nb`（非阻塞接收）等方法。
4. **实现选择操作**：实现了 `select` 函数，它可以同时监听多个通道上的事件。

#### 具体代码分析

- **`Channel` 类型**：

  - 使用互斥锁、条件变量来同步对内部缓冲区的访问。
  - 提供了标准的发送（`put`）和接收（`get`）方法，以及非阻塞的变体（`send_nb` 和 `recv_nb`）。
  - 支持选择操作，使得可以同时等待多个通道上的事件。

- **`select` 函数**：

  - 接受一个 `SelectCase` 数组，每个 `SelectCase` 关联一个通道和操作类型（发送或接收）。
  - 通过循环尝试在给定的通道上执行操作，直到某个操作成功。

- **生产者-消费者模式**：

  - 实现了 `producer` 和 `consumer` 函数来演示通道的使用。
  - `producer` 向通道发送一系列消息，而 `consumer` 从通道接收这些消息。

- **主函数（`main`）**：
  - 演示了如何创建通道，启动生产者和消费者线程，并等待它们完成。
  - 还展示了如何使用非阻塞通道和选择操作进行线程间通信。

#### 关键点

- **通道（Channel）**：通道是并发编程中的一个重要概念，用于线程间的通信和同步。
- **互斥锁和条件变量**：这些并发原语用于保护通道的内部状态，确保线程安全。
- **选择操作**：`select` 函数使得可以同时等待多个通道上的事件，增加了并发程序的灵活性和效率。
- **生产者-消费者模式**：这是一种常见的并发模式，适用于多个生产者和消费者之间的数据交换。

这块可以学习到 Zig 中高级并发编程的概念，包括自定义通道的实现、线程间的同步机制，以及如何在复杂的场景下协调多个线程的行为。这对于构建能够处理复杂并发任务的高效程序至关重要。
