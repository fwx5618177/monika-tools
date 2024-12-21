---
title: 【Zig】Concurrency Implementation Methods
author: fwx
language: English
tags:
  - Zig
  - Concurrency
  - Multi-threaded Data Transfer
description: >-
  Mainly introduces several methods provided by Zig - Mutex, Condition,
  Semaphore, WaitGroup, Event.Channel. As Zig's Channel is not yet effective, we
  will create a basic Channel and Select based on Mutex.
excerpt: Zig's concurrency implementation methods. Mainly implemented through mutex.
addition:
  - English
  - Zig
type: Article
isSticky: true
id: ab8ebdc3-78d5-45f4-894e-0f8d54c51b90
slug: 620cb6b8e11ea9b56cf299e83e9a28
---

# 【Zig】Concurrency Implementation Methods

## Global Memory and Mutex

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

This code example demonstrates how to use multi-threading and mutexes (Mutex) in Zig language to safely update shared data. This is a common scenario in concurrent programming, especially when multiple threads need to read and modify the same data.

#### Code Overview

1. **Import Standard Library**: Use `@import("std")` to import Zig's standard library.
2. **Define Mutex and Thread-related Functions**: Use `Mutex`, `spawn`, and `SpawnConfig` from the `Thread` module.
3. **Define Shared Data Structure** (`SharedData`):
   - Contains a `Mutex` and an integer value `value`.
   - Provides two methods `updateValue` and `tryUpdateValue` to update `value`.

#### Detailed Code Analysis

- `SharedData` Structure:

  - **Mutex**: Used to control access to `value`, ensuring that only one thread can modify it at a time.
  - **`updateValue` Method**: Locks the mutex, then increments `value`, and finally unlocks. Uses a `defer` statement to ensure the lock is released even if an error occurs.
  - **`tryUpdateValue` Method**: Attempts to lock the mutex, updates `value` if successful, otherwise returns `false`.

- **Thread Functions**:

  - `threadFuncMultipleArgs` and `threadFunc`: These functions show how to pass arguments to threads. They receive a `SharedData` instance and call the `updateValue` method.

- **Main Function (`main`)**:

  - Initializes shared data and thread configuration.
  - Creates two threads, each calling `threadFunc` with different arguments.
  - Waits for the threads to complete, then prints the final `value`.

- **Test Case**:
  - Demonstrates how to test the `updateValue` method of `SharedData`.

## Condition Variables and Mutexes

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

This Zig code snippet is an excellent example of the use of condition variables (Condition Variable) and mutexes (Mutex). In concurrent programming, condition variables are used for synchronization between threads, particularly when certain conditions change. Below is a detailed explanation of the code.

#### Code Overview

1. **Import Standard Library**: Uses `@import("std")` to import Zig's standard library.
2. **Define Mutex and Condition Variable**: Utilizes `Mutex` and `Condition` from the `Thread` module.
3. **Define Global Variables**: `mutex` is used to synchronize access to a shared resource, `cond` is the condition variable, and `ready` is a boolean variable indicating whether a specific condition is met.

#### Detailed Code Analysis

- **Worker Thread Function `worker`**:

  - Acquires the mutex.
  - Uses a `while` loop to check the status of the `ready` variable. If `ready` is `false`, the thread waits on the condition variable `cond`.
  - When `ready` becomes `true`, the thread continues execution and releases the lock.

- **Main Function (`main`)**:
  - Starts the worker thread.
  - The main thread sleeps for one second, simulating some processing.
  - Acquires the mutex, sets `ready` to `true`, and signals the condition variable `cond` to wake up the waiting thread.
  - Releases the mutex and waits for the worker thread to finish.

#### Key Points

- **Condition Variable**: Condition variables are used for synchronization between threads. When a certain condition (in this case, the `ready` variable) changes, one thread can notify other threads.

## Semaphore and Mutex Usage

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

#### Code Overview

1. **Import Standard Library**: Uses `@import("std")` to import Zig's standard library.
2. **Define Semaphore**: Creates a global variable `semaphore` of type `Thread.Semaphore` to control access to resources.
3. **Initialize Semaphore**: The semaphore is initialized to 1, meaning that at any given time, only one thread is allowed to modify it.

#### Detailed Code Analysis

- **Thread Function `threadFunc`**:

  - Prints a message indicating the thread has started.
  - Uses the semaphore for synchronization within a loop:
    - The thread requests access to resources by calling `semaphore.wait()`. If the semaphore's value is 0, the thread waits until the semaphore's value increases.
    - The thread increments the semaphore’s value (simulating modification of a shared resource).
    - The thread prints the semaphore's value before and after modification.
    - The thread releases the semaphore by calling `semaphore.post()`, allowing other threads to access the resource.
    - The thread sleeps for one second, simulating execution time.

- **Main Function (`main`)**:
  - Prints the initial semaphore value.
  - Creates and starts two threads, each running the `threadFunc` function.
  - Waits for both threads to complete.
  - Prints the final semaphore value.

#### Key Points

- **Semaphore**: Semaphore is a synchronization mechanism used to control access to shared resources. In this example, the semaphore ensures that at any given time, only one thread can modify the semaphore's value.
- **Wait and Post**: The semaphore's `wait()` method is used to request access to resources, while the `post()` method is used to release resources.
- **Synchronization Between Threads**: By using the semaphore, threads must wait for other threads to release resources before modifying shared resources (in this case, the `permits` field of the semaphore).

## Synchronizing Threads Using Wait Group

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

#### Code Overview

1. **Import Standard Library**: Uses `@import("std")` to import Zig's standard library.
2. **Define Shared Data Structure** (`SharedData`): A simple structure containing an integer value `value`.
3. **Initialize Shared Data**: Creates an instance of `SharedData` named `shared_data`, with its `value` initialized to 0.

#### Detailed Code Analysis

- **Thread Function `threadFunc`**:

  - Prints a message indicating the start of the thread and displays the thread's increment value.
  - Increments the `shared_data.value` in a loop.
  - Calls `wg.finish()` to indicate the thread has completed its work.
  - Prints a message indicating the end of the thread.

- **Main Function (`main`)**:
  - Initializes the Wait Group (`WaitGroup`).
  - Creates an array of threads `threads`.
  - In a loop, for each thread:
    - Calls `wg.start()` to signal the start of a new thread.
    - Creates a thread using `spawn` to execute `threadFunc`.
  - Calls `wg.wait()` to wait for all threads to complete.
  - Joins (`join`) all threads to ensure they have all finished.
  - Prints the final value of `shared_data.value`.

#### Key Points

- **Wait Group (WaitGroup)**: A Wait Group is used to track and wait for the completion of a group of threads. `wg.start()` is called when a new thread starts; `wg.finish()` is called when a thread ends.
- **Access to Shared Data**: All threads in the example share the `shared_data` instance. Each thread modifies the value of `shared_data.value`.
- **Thread Creation and Management**: Uses the `spawn` function to create and start threads, and the `join` method to wait for thread completion.
- **Considerations for Concurrent Data Access**: This code example, for simplicity, does not use locks or other synchronization mechanisms to protect shared data. In practical applications, where multiple threads modify the same data concurrently, mutexes or atomic operations should be used to prevent race conditions.

This pattern simplifies managing the lifecycle of threads, especially when waiting for multiple threads to complete their work. However, it is important to ensure thread safety when dealing with shared data to avoid data races.

## Custom Channels and Concurrent Programming

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

This Zig code snippet implements a custom channel (Channel) type, demonstrating how to use channels for data transfer and synchronization between threads. It's an advanced example of concurrent programming involving semaphores, mutexes, condition variables, and select operations.

#### Code Overview

1. **Import Standard Library**: Uses `@import("std")` to import Zig's standard library.
2. **Define Custom Channel Type**: Implements a generic structure named `Channel` for inter-thread message passing.
3. **Implement Basic Channel Operations**: Includes methods like `put`, `get`, `send_nb` (non-blocking send), and `recv_nb` (non-blocking receive).
4. **Implement Select Operation**: Implements the `select` function, which can listen for events on multiple channels simultaneously.

#### Detailed Code Analysis

- **`Channel` Type**:

  - Uses mutexes and condition variables to synchronize access to the internal buffer.
  - Provides standard send (`put`) and receive (`get`) methods, as well as non-blocking variants (`send_nb` and `recv_nb`).
  - Supports select operations, allowing to wait for events on multiple channels at the same time.

- **`select` Function**:

  - Takes an array of `SelectCase`, each associated with a channel and an operation type (send or receive).
  - Attempts to perform operations on specified channels in a loop until one succeeds.

- **Producer-Consumer Pattern**:

  - Implements `producer` and `consumer` functions to demonstrate the use of channels.
  - `producer` sends a series of messages to the channel, while `consumer` receives these messages from the channel.

- **Main Function (`main`)**:
  - Demonstrates how to create channels, start producer and consumer threads, and wait for their completion.
  - Also shows how to use non-blocking channels and select operations for inter-thread communication.

#### Key Points

- **Channel**: Channel is an important concept in concurrent programming, used for communication and synchronization between threads.
- **Mutexes and Condition Variables**: These concurrency primitives are used to protect the internal state of the channel, ensuring thread safety.
- **Select Operation**: The `select` function allows waiting for events on multiple channels simultaneously, enhancing the flexibility and efficiency of concurrent programs.
- **Producer-Consumer Pattern**: This is a common concurrency pattern suitable for data exchange between multiple producers and consumers.

This code offers insights into advanced concurrent programming concepts in Zig, including the implementation of custom channels, synchronization mechanisms between threads, and how to coordinate the behavior of multiple threads in complex scenarios. It's crucial for building efficient programs capable of handling complex concurrent tasks.
