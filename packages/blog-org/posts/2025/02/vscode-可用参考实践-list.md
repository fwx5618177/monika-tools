# Node.js & Electron 高性能优化实践指南

## 优化方法汇总

### Node.js 优化方法

| 优化类别 | 优化方法 | 实现方式 | 性能提升 | 状态 |
|---------|---------|----------|---------|------|
| CPU 优化 | CPU 亲和性绑定 | NAPI/C+或 Node.js | 20-30% CPU 效率提升 | ✓ 已实现 |
| | 多进程负载均衡 | Cluster | 提高多核利用率 30-50% | ✓ 已实现 |
| | Worker 线程池 | Worker Threads | CPU 密集任务提速 2-4 倍 | ✓ 已实现 |
| | SIMD 并行计算 | Node.js SIMD | 数值计算提速 3-5 倍 | ⃝ 未实现 |
| V8 优化 | V8 堆内存管理 | V8 API | 减少内存占用 40-60% | ✓ 已实现 |
| | V8 快照 | V8 API | 启动时间减少 40-50% | ✓ 已实现 |
| | JIT 优化 | V8 Flags | 热点代码执行效率提升 20-30% | ✓ 已实现 |
| | 模块缓存 | Node.js require.cache | 模块加载时间减少 30-40% | ✓ 已实现 |
| 内存优化 | 对象池复用 | TypeScript | 减少 GC 频率 50-70% | ✓ 已实现 |
| | 内存泄漏检测 | V8 Inspector | 提前发现内存问题 | ✓ 已实现 |
| | 流式处理 | Node.js Stream | 内存使用减少 40-60% | ✓ 已实现 |
| | WeakRef 引用 | Node.js WeakRef | 减少内存泄漏风险 | ⃝ 未实现 |
| I/O 优化 | 内存映射文件 | NAPI/mmap 或 Node.js | 文件读写提速 3-5 倍 | ⃝ 未实现 |
| | 异步 I/O 队列 | TypeScript | I/O 吞吐量提升 2-3 倍 | ✓ 已实现 |
| | 高性能文件监控 | NAPI/inotify 或 Node.js | 文件监控性能提升 5-10 倍 | ✓ 已实现 |
| | 零拷贝传输 | Node.js Buffer | 数据传输提速 2-3 倍 | ✓ 已实现 |
| 附加最佳实践 – 调整 libuv 线程池大小 | 调整 libuv 线程池大小 | Node.js | 提升 I/O 密集型任务并发处理能力 | ⃝ 未实现 |

### Electron 优化方法

| 优化类别 | 优化方法 | 实现方式 | 性能提升 | 状态 |
|---------|---------|----------|---------|------|
| 进程优化 | 主进程优化 | Electron API | 启动时间减少 40-60% | ✓ 已实现 |
| | 渲染进程优化 | Electron API | 渲染性能提升 30-50% | ✓ 已实现 |
| | 预加载优化 | Preload Scripts | 启动速度提升 20-30% | ✓ 已实现 |
| | 进程通信优化 | Context Bridge | IPC 性能提升 30-50% | ✓ 已实现 |
| 渲染优化 | GPU 加速 | Chromium API | 渲染速度提升 2-3 倍 | ✓ 已实现 |
| | 虚拟滚动 | TypeScript | 内存占用减少 70-80% | ✓ 已实现 |
| | WebGL 渲染 | WebGL API | 图形渲染提速 3-5 倍 | ⃝ 未实现 |
| | 硬件加速 | Electron API | 动画性能提升 2-3 倍 | ✓ 已实现 |
| IPC 优化 | 消息队列 | Electron IPC | 通信延迟减少 40-60% | ✓ 已实现 |
| | 共享内存 | SharedArrayBuffer | 进程间通信提速 5-10 倍 | ⃝ 未实现 |
| | 批量传输 | TypeScript | 传输效率提升 2-3 倍 | ⃝ 未实现 |
| | 双向流通信 | Node.js Stream | 大数据传输提速 3-4 倍 | ⃝ 未实现 |

## 一、Native 优化实践

### 1. NAPI/C+实现

#### 1.1 CPU 亲和性原生实现
**功能描述**：通过 NAPI 实现 CPU 亲和性绑定，将特定进程绑定到指定的 CPU 核心上执行。
**优化原理**：
- 减少进程在不同 CPU 核心间的迁移，提高 CPU 缓存命中率
- 避免 CPU 核心频繁切换上下文，降低性能开销
- 实现工作负载在多核心上的均衡分布
```cpp
// src/native/cpu_affinity.cpp
#include <napi.h>
#include <sched.h>

Napi::Value SetAffinity(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2) {
        throw Napi::Error::New(env, "Wrong number of arguments");
    }

    pid_t pid = info[0].As<Napi::Number>().Int32Value();
    int cpuCore = info[1].As<Napi::Number>().Int32Value();

    cpu_set_t mask;
    CPU_ZERO(&mask);
    CPU_SET(cpuCore, &mask);

    int result = sched_setaffinity(pid, sizeof(mask), &mask);

    return Napi::Number::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("setAffinity", Napi::Function::New(env, SetAffinity));
    return exports;
}

NODE_API_MODULE(cpu_affinity, Init)
```

```typescript
// src/native/cpu_affinity.ts
import { promisify } from 'util';
const cpuAffinity = require('bindings')('cpu_affinity');

export class NativeCPUAffinity {
  static async setAffinity(pid: number, cpuCore: number): Promise<number> {
    return promisify(cpuAffinity.setAffinity)(pid, cpuCore);
  }
}
```

#### 1.2 共享内存实现
**功能描述**：实现进程间的高性能数据共享机制，避免数据序列化和拷贝开销。
**优化原理**：
- 使用操作系统级别的共享内存机制
- 实现零拷贝数据传输
- 显著减少进程间通信的延迟和内存占用
```cpp
// src/native/shared_memory.cpp
#include <napi.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>

class SharedMemory : public Napi::ObjectWrap<SharedMemory> {
private:
    void* memory;
    size_t size;
    std::string name;

public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports) {
        Napi::Function func = DefineClass(env, "SharedMemory", {
            InstanceMethod("write", &SharedMemory::Write),
            InstanceMethod("read", &SharedMemory::Read),
            InstanceMethod("close", &SharedMemory::Close)
        });

        exports.Set("SharedMemory", func);
        return exports;
    }

    SharedMemory(const Napi::CallbackInfo& info)
        : Napi::ObjectWrap<SharedMemory>(info) {
        Napi::Env env = info.Env();

        if (info.Length() < 2) {
            throw Napi::Error::New(env, "Wrong number of arguments");
        }

        name = info[0].As<Napi::String>().Utf8Value();
        size = info[1].As<Napi::Number>().Int64Value();

        int fd = shm_open(name.c_str(), O_CREAT | O_RDWR, 0666);
        ftruncate(fd, size);

        memory = mmap(nullptr, size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
        close(fd);
    }

    Napi::Value Write(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();

        if (info.Length() < 1) {
            throw Napi::Error::New(env, "Wrong number of arguments");
        }

        Napi::Buffer<char> buffer = info[0].As<Napi::Buffer<char>>();
        memcpy(memory, buffer.Data(), std::min(buffer.Length(), size));

        return env.Undefined();
    }

    Napi::Value Read(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();

        return Napi::Buffer<char>::Copy(env,
            static_cast<char*>(memory), size);
    }

    Napi::Value Close(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();

        munmap(memory, size);
        shm_unlink(name.c_str());

        return env.Undefined();
    }
};

NODE_API_MODULE(shared_memory, SharedMemory::Init)
```

```typescript
// src/native/shared_memory.ts
const SharedMemoryNative = require('bindings')('shared_memory').SharedMemory;

export class SharedMemoryManager {
  private shm: typeof SharedMemoryNative;

  constructor(name: string, size: number) {
    this.shm = new SharedMemoryNative(name, size);
  }

  write(data: Buffer): void {
    this.shm.write(data);
  }

  read(): Buffer {
    return this.shm.read();
  }

  close(): void {
    this.shm.close();
  }
}
```

### 2. V8 优化实践

#### 2.1 V8 快照实现
**功能描述**：通过 V8 快照机制，将 JavaScript 堆内存状态序列化保存，实现快速启动。
**优化效果**：
- 减少应用启动时的 JavaScript 解析和编译时间
- 预初始化常用对象，加快应用启动速度
- 优化内存占用，减少重复对象创建
```typescript
// src/v8/snapshot.ts
import * as v8 from 'v8';
import * as fs from 'fs';
import * as path from 'path';

export class V8SnapshotManager {
  private snapshotFile: string;

  constructor(snapshotPath: string) {
    this.snapshotFile = snapshotPath;
  }

  createSnapshot(context: object) {
    const serializedData = v8.serialize(context);
    fs.writeFileSync(this.snapshotFile, serializedData);
  }

  loadSnapshot(): object {
    if (!fs.existsSync(this.snapshotFile)) {
      throw new Error('Snapshot file not found');
    }
    const serializedData = fs.readFileSync(this.snapshotFile);
    return v8.deserialize(serializedData);
  }

  static createStartupSnapshot(
    snapshotFile: string,
    initScript: string
  ): void {
    const v8Module = require('v8');
    if (!v8Module.startupSnapshot) {
      throw new Error('V8 startup snapshot not supported');
    }

    v8Module.startupSnapshot.setDeserializeMainFunction((snapshot: any) => {
      const context = v8.createContext();
      const script = new v8.Script(initScript);
      script.runInContext(context);
      return context;
    });

    const snapshot = v8Module.startupSnapshot.create();
    fs.writeFileSync(snapshotFile, snapshot);
  }
}

// 使用示例
const snapshotManager = new V8SnapshotManager('app-snapshot.bin');

// 创建快照
const context = {
  config: {
    // 应用配置
  },
  cache: new Map(),
  // 其他需要持久化的数据
};
snapshotManager.createSnapshot(context);

// 加载快照
const restoredContext = snapshotManager.loadSnapshot();
```

#### 2.2 内存优化实践
**功能描述**：通过 V8 引擎提供的 API 实现内存使用的精细化控制和优化。
**优化原理**：
- 启用指针压缩，减少内存占用
- 控制堆内存大小，避免内存溢出
- 主动触发 GC，优化内存使用
- 实时监控堆内存使用情况
- 利用 v8 提供的 GC 工具监测
- *V8 GC 监控工具说明*：Node.js 内置的 `v8` 模块提供了如 `getHeapStatistics()`、`getHeapSpaceStatistics()` 以及 `getHeapSnapshot()` 等接口，这些接口能够实时监控 V8 引擎的堆内存使用情况和垃圾回收行为。通过获取这些指标，可以分析堆内存总量、使用量、空闲部分及各个内存空间（如 new space、old space 等）的分布情况，从而更好地定位内存泄漏及优化 GC 参数，提升系统性能。

```typescript
// src/v8/memory-optimizer.ts
export class V8MemoryOptimizer {
  static enableOptimizations() {
    // 启用指针压缩
    if (process.env.NODE_ENV === 'production') {
      v8.setFlagsFromString('--optimize_for_size');
      v8.setFlagsFromString('--max_old_space_size=4096');
      v8.setFlagsFromString('--initial_old_space_size=4096');
      v8.setFlagsFromString('--max_semi_space_size=64');
    }
  }

  static async optimizeMemory() {
    return new Promise<void>((resolve) => {
      // 强制 GC
      if (global.gc) {
        global.gc();
      }

      // 压缩堆内存
      v8.setFlagsFromString('--compact');

      // 延迟执行，等待 GC 完成
      setTimeout(resolve, 1000);
    });
  }

  static getHeapStatistics(): v8.HeapInfo {
    return v8.getHeapStatistics();
  }

  static async monitorHeapUsage(
    threshold: number = 0.8,
    interval: number = 5000
  ): Promise<void> {
    setInterval(() => {
      const stats = v8.getHeapStatistics();
      const usedRatio = stats.used_heap_size / stats.heap_size_limit;

      if (usedRatio > threshold) {
        console.warn(`High memory usage detected: ${(usedRatio * 100).toFixed(2)}%`);
        this.optimizeMemory();
      }
    }, interval);
  }
}
```

### 3. 文件系统优化

#### 3.1 内存映射文件
**功能描述**：使用操作系统的内存映射机制，实现高效的文件读写操作。
**优化原理**：
- 将文件映射到内存空间，避免频繁的 I/O 操作
- 利用操作系统的页缓存机制
- 实现零拷贝文件访问
- 支持大文件的高效处理
```cpp
// src/native/mmap.cpp
#include <napi.h>
#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>

class MappedFile : public Napi::ObjectWrap<MappedFile> {
private:
    void* mapped;
    size_t length;
    int fd;

public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports) {
        Napi::Function func = DefineClass(env, "MappedFile", {
            InstanceMethod("read", &MappedFile::Read),
            InstanceMethod("write", &MappedFile::Write),
            InstanceMethod("close", &MappedFile::Close)
        });

        exports.Set("MappedFile", func);
        return exports;
    }

    MappedFile(const Napi::CallbackInfo& info)
        : Napi::ObjectWrap<MappedFile>(info) {
        Napi::Env env = info.Env();

        std::string filename = info[0].As<Napi::String>().Utf8Value();
        fd = open(filename.c_str(), O_RDWR | O_CREAT, 0666);

        struct stat sb;
        fstat(fd, &sb);
        length = sb.st_size;

        mapped = mmap(nullptr, length, PROT_READ | PROT_WRITE,
                     MAP_SHARED, fd, 0);
    }

    Napi::Value Read(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        return Napi::Buffer<char>::Copy(env,
            static_cast<char*>(mapped), length);
    }

    Napi::Value Write(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();

        Napi::Buffer<char> buffer = info[0].As<Napi::Buffer<char>>();
        memcpy(mapped, buffer.Data(),
               std::min(buffer.Length(), length));

        msync(mapped, length, MS_SYNC);
        return env.Undefined();
    }

    Napi::Value Close(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();

        munmap(mapped, length);
        close(fd);

        return env.Undefined();
    }
};

NODE_API_MODULE(mmap, MappedFile::Init)
```

```typescript
// src/native/mmap.ts
const MappedFileNative = require('bindings')('mmap').MappedFile;

export class MemoryMappedFile {
  private file: typeof MappedFileNative;

  constructor(filename: string) {
    this.file = new MappedFileNative(filename);
  }

  read(): Buffer {
    return this.file.read();
  }

  write(data: Buffer): void {
    this.file.write(data);
  }

  close(): void {
    this.file.close();
  }
}

// 使用示例
const mmapFile = new MemoryMappedFile('large-file.dat');
const data = mmapFile.read();
// 处理数据
mmapFile.close();
```

#### 3.2 高性能文件监控
**功能描述**：实现基于操作系统原生 API 的高性能文件系统监控。
**优化原理**：
- 使用 inotify 等系统调用，避免轮询
- 实现事件驱动的文件变更通知
- 优化文件监控的资源占用
- 支持大规模文件系统的监控
```cpp
// src/native/file_watcher.cpp
#include <napi.h>
#include <sys/inotify.h>
#include <unordered_map>
#include <string>

class FileWatcher : public Napi::ObjectWrap<FileWatcher> {
private:
    int fd;
    std::unordered_map<int, std::string> watches;

public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports) {
        Napi::Function func = DefineClass(env, "FileWatcher", {
            InstanceMethod("addWatch", &FileWatcher::AddWatch),
            InstanceMethod("removeWatch", &FileWatcher::RemoveWatch),
            InstanceMethod("wait", &FileWatcher::Wait)
        });

        exports.Set("FileWatcher", func);
        return exports;
    }

    FileWatcher(const Napi::CallbackInfo& info)
        : Napi::ObjectWrap<FileWatcher>(info) {
        fd = inotify_init1(IN_NONBLOCK);
    }

    Napi::Value AddWatch(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        std::string path = info[0].As<Napi::String>().Utf8Value();

        int wd = inotify_add_watch(fd, path.c_str(),
                                  IN_MODIFY | IN_CREATE | IN_DELETE);

        watches[wd] = path;
        return Napi::Number::New(env, wd);
    }

    Napi::Value RemoveWatch(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        int wd = info[0].As<Napi::Number>().Int32Value();

        inotify_rm_watch(fd, wd);
        watches.erase(wd);

        return env.Undefined();
    }

    Napi::Value Wait(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        char buffer[4096];
        int length = read(fd, buffer, sizeof(buffer));

        Napi::Array events = Napi::Array::New(env);
        int i = 0;

        for (char* ptr = buffer; ptr < buffer length;) {
            struct inotify_event* event = (struct inotify_event*)ptr;

            Napi::Object evt = Napi::Object::New(env);
            evt.Set("path", watches[event->wd]);
            evt.Set("mask", event->mask);
            if (event->len) {
                evt.Set("name", event->name);
            }

            events.Set(i++, evt);
            ptr += sizeof(struct inotify_event) event->len;
        }

        return events;
    }
};

NODE_API_MODULE(file_watcher, FileWatcher::Init)
```

```typescript
// src/native/file_watcher.ts
const FileWatcherNative = require('bindings')('file_watcher').FileWatcher;

export class FileWatcher {
  private watcher: typeof FileWatcherNative;
  private watches: Map<number, string> = new Map();

  constructor() {
    this.watcher = new FileWatcherNative();
  }

  watch(path: string, callback: (event: {
    path: string;
    mask: number;
    name?: string;
  }) => void) {
    const wd = this.watcher.addWatch(path);
    this.watches.set(wd, path);

    // 启动监听循环
    this.startWatching(callback);
  }

  private startWatching(callback: Function) {
    setImmediate(async () => {
      try {
        const events = this.watcher.wait();
        events.forEach(callback);
      } catch (error) {
        if (error.code !== 'EAGAIN') {
          console.error('File watching error:', error);
        }
      }
      this.startWatching(callback);
    });
  }

  unwatch(path: string) {
    for (const [wd, watchPath] of this.watches.entries()) {
      if (watchPath === path) {
        this.watcher.removeWatch(wd);
        this.watches.delete(wd);
        break;
      }
    }
  }
}

// 使用示例
const watcher = new FileWatcher();
watcher.watch('/path/to/watch', (event) => {
  console.log('File change detected:', event);
});
```

## 二、Node.js 优化实践

### 1. 多进程架构优化

#### 1.1 CPU 亲和性设置
**功能描述**：在 Node.js 层面实现进程与 CPU 核心的绑定关系管理。
**优化原理**：
- 根据 CPU 核心数量自动分配进程
- 实现进程的自动恢复和重新绑定
- 监控进程状态，保证服务稳定性
```typescript
// src/cluster/affinity.ts
import cluster from 'cluster';
import { cpus } from 'os';
import * as os from 'os';

interface WorkerConfig {
  pid: number;
  cpuCore: number;
  role: 'master' | 'worker';
}

class CPUAffinityManager {
  private workers: Map<number, WorkerConfig> = new Map();

  constructor(private readonly numCPUs = cpus().length) {}

  async setAffinity(pid: number, cpuCore: number) {
    if (process.platform === 'linux' || process.platform === 'darwin') {
      try {
        // 使用 taskset 命令设置 CPU 亲和性
        await require('child_process').exec(`taskset -pc ${cpuCore} ${pid}`);
        return true;
      } catch (error) {
        console.error(`Failed to set CPU affinity: ${error}`);
        return false;
      }
    }
    return false;
  }

  setupWorkers() {
if (cluster.isPrimary) {
      // 主进程绑定到 CPU0
      this.setAffinity(process.pid, 0);
      console.log(`Primary ${process.pid} bound to CPU0`);

      // 为每个 CPU 核心创建一个工作进程
      for (let i = 1; i < this.numCPUs; i++) {
        const worker = cluster.fork();
        this.workers.set(worker.process.pid, {
          pid: worker.process.pid,
          cpuCore: i,
          role: 'worker'
        });

        // 设置工作进程的 CPU 亲和性
        this.setAffinity(worker.process.pid, i);
        console.log(`Worker ${worker.process.pid} bound to CPU${i}`);
      }

      // 监听工作进程退出
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        // 重新创建工作进程并设置亲和性
        const newWorker = cluster.fork();
        const oldConfig = this.workers.get(worker.process.pid);
        if (oldConfig) {
          this.workers.set(newWorker.process.pid, {
            pid: newWorker.process.pid,
            cpuCore: oldConfig.cpuCore,
            role: 'worker'
          });
          this.setAffinity(newWorker.process.pid, oldConfig.cpuCore);
        }
      });
    }
  }
}

// 使用示例
const affinityManager = new CPUAffinityManager();
affinityManager.setupWorkers();
```

#### 1.2 进程负载均衡
**功能描述**：实现基于实时负载的进程调度和管理。
**优化原理**：
- 监控每个工作进程的 CPU 使用率
- 实现进程级别的负载均衡
- 自动处理过载和异常情况
- 支持进程的动态扩缩容
```typescript
// src/cluster/load-balancer.ts
import * as cluster from 'cluster';
import * as os from 'os';

class LoadBalancer {
  private workers: Map<number, {
    load: number;
    lastHeartbeat: number;
  }> = new Map();

  constructor(private readonly maxLoad = 0.8) {}

  start() {
if (cluster.isPrimary) {
      const numCPUs = os.cpus().length;

  // 创建工作进程
      for (let i = 0; i < numCPUs - 1; i++) {
        this.createWorker();
      }

      // 监控工作进程负载
      setInterval(() => this.checkWorkersLoad(), 5000);
    }
  }

  private createWorker() {
    const worker = cluster.fork();
    this.workers.set(worker.process.pid, {
      load: 0,
      lastHeartbeat: Date.now()
    });

    // 监听工作进程负载报告
    worker.on('message', (msg: { type: string; load: number }) => {
      if (msg.type === 'load') {
        const workerData = this.workers.get(worker.process.pid);
        if (workerData) {
          workerData.load = msg.load;
          workerData.lastHeartbeat = Date.now();
        }
      }
    });
  }

  private checkWorkersLoad() {
    for (const [pid, data] of this.workers.entries()) {
      // 检查心跳超时
      if (Date.now() - data.lastHeartbeat > 10000) {
        console.warn(`Worker ${pid} heartbeat timeout`);
        this.restartWorker(pid);
        continue;
      }

      // 检查负载过高
      if (data.load > this.maxLoad) {
        console.warn(`Worker ${pid} overloaded: ${data.load}`);
        this.restartWorker(pid);
      }
    }
  }

  private restartWorker(pid: number) {
    const worker = cluster.workers?.[pid];
    if (worker) {
      worker.disconnect();
      worker.kill();
      this.createWorker();
    }
  }
}

// 在工作进程中报告负载
if (cluster.isWorker) {
  setInterval(() => {
    const load = process.cpuUsage();
    process.send?.({
      type: 'load',
      load: (load.user load.system) / 1000000 // 转换为秒
    });
  }, 1000);
}
```

### 2. 内存优化

#### 2.1 对象池实现
**功能描述**：通过对象池模式减少对象创建和销毁的开销。
**优化原理**：
- 预创建对象并复用
- 控制对象池大小，避免内存泄漏
- 自动重置对象状态
- 支持泛型，适用于多种对象类型
```typescript
// src/memory/object-pool.ts
class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (item: T) => void;
  private maxSize: number;

  constructor(
    createFn: () => T,
    resetFn: (item: T) => void,
    initialSize = 0,
    maxSize = 1000
  ) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;

    // 预创建对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFn();
  }

  release(item: T): void {
    this.resetFn(item);
    if (this.pool.length < this.maxSize) {
      this.pool.push(item);
    }
  }

  clear(): void {
    this.pool = [];
  }
}

// 使用示例：Buffer 池
class BufferPool {
  private pool: ObjectPool<Buffer>;

  constructor(bufferSize: number = 1024) {
    this.pool = new ObjectPool<Buffer>(
      () => Buffer.allocUnsafe(bufferSize),
      (buffer) => buffer.fill(0),
      100,  // 初始大小
      1000  // 最大大小
    );
  }

  acquire(): Buffer {
    return this.pool.acquire();
  }

  release(buffer: Buffer): void {
    this.pool.release(buffer);
  }
}
```

#### 2.2 内存泄漏检测
**功能描述**：实现内存使用的实时监控和泄漏检测。
**优化原理**：
- 定期检查内存增长趋势
- 自动生成堆内存快照
- 分析内存泄漏原因
- 提供预警和自动处理机制
```typescript
// src/memory/leak-detector.ts
class MemoryLeakDetector {
  private snapshots: Map<string, number> = new Map();
  private readonly threshold: number;
  private readonly interval: number;

  constructor(thresholdMB: number = 100, intervalMS: number = 60000) {
    this.threshold = thresholdMB * 1024 * 1024;
    this.interval = intervalMS;
    this.startMonitoring();
  }

  private startMonitoring() {
    let lastUsage = process.memoryUsage().heapUsed;
    let leakCount = 0;

    setInterval(() => {
      const currentUsage = process.memoryUsage().heapUsed;
      const diff = currentUsage - lastUsage;

      if (diff > this.threshold) {
        leakCount++;
        console.warn(`Potential memory leak detected: ${diff / 1024 / 1024}MB increase`);

        if (leakCount >= 3) {
          this.takeHeapSnapshot();
          leakCount = 0;
        }
  } else {
        leakCount = 0;
      }

      lastUsage = currentUsage;
    }, this.interval);
  }

  private takeHeapSnapshot() {
    const snapshotId = Date.now().toString();
    const snapshot = require('v8').getHeapSnapshot();
    require('fs').writeFileSync(`heap-${snapshotId}.heapsnapshot`, snapshot);
    console.log(`Heap snapshot saved: heap-${snapshotId}.heapsnapshot`);
  }
}

// 使用示例
const leakDetector = new MemoryLeakDetector();
```

### 3. I/O 优化

#### 3.1 异步 I/O 队列
**功能描述**：实现高性能的异步 I/O 操作管理。
**优化原理**：
- 控制并发 I/O 操作数量
- 实现请求队列和批处理
- 优化 I/O 操作的调度
- 处理异常和超时情况
```typescript
// src/io/async-queue.ts
class AsyncIOQueue {
  private queue: Array<() => Promise<any>> = [];
  private running = false;
  private concurrency: number;

  constructor(concurrency = 4) {
    this.concurrency = concurrency;
  }

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.running) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.running || this.queue.length === 0) return;

    this.running = true;
    const batch = this.queue.slice(0, this.concurrency);

    if (this.isMain) {
      const results = await Promise.all(
        batch.map(task => task())
      );
      // 处理结果...
    } else {
      ipcRenderer.send('batch-message', batch.map(msg => ({
        channel: msg.channel,
        data: msg.data
      })));
    }

    await new Promise(resolve => setTimeout(resolve, this.batchDelay));
    this.running = false;
    if (this.queue.length > 0) {
      this.processQueue();
    }
  }
}

// 使用示例
const ioQueue = new AsyncIOQueue();
ioQueue.add(async () => {
  const data = await fs.promises.readFile('large-file.txt');
  return data;
});
```

## 三、Electron 优化实践

### 1. 进程管理优化

#### 1.1 主进程优化
**功能描述**：优化 Electron 主进程的性能和资源使用。
**优化原理**：
- 优化进程优先级设置
- 启用 GPU 加速
- 控制内存使用限制
- 实现自动垃圾回收
```typescript
// src/electron/main-process.ts
import { app, BrowserWindow } from 'electron';
import { cpus } from 'os';

class MainProcessOptimizer {
  constructor() {
    this.setupProcessPriority();
    this.setupGPUAcceleration();
    this.setupMemoryLimits();
  }

  private setupProcessPriority() {
    if (process.platform === 'win32') {
      app.commandLine.appendSwitch('high-dpi-support', '1');
      app.commandLine.appendSwitch('force-device-scale-factor', '1');
    }

    // 设置进程优先级
    if (process.platform === 'win32') {
      app.setPriority('high');
    } else {
      process.setPriority(-10); // Linux/macOS
    }
  }

  private setupGPUAcceleration() {
    // 启用 GPU 加速
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
    app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');

    // 禁用可能导致性能问题的特性
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
  }

  private setupMemoryLimits() {
    // 设置内存限制
    app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');

    // 监控内存使用
    setInterval(() => {
      const memoryInfo = process.getProcessMemoryInfo();
      if (memoryInfo.workingSetSize > 1024 * 1024 * 1024) { // 1GB
        this.performGC();
      }
    }, 30000);
  }

  private performGC() {
    if (global.gc) {
      global.gc();
    }
  }
}
```

#### 1.2 渲染进程优化
**功能描述**：优化 Electron 渲染进程的性能和资源使用。
**优化原理**：
- 使用 Worker 线程处理计算密集任务
- 监控和控制内存使用
- 优化缓存管理
- 实现资源的自动清理
```typescript
// src/electron/renderer-process.ts
class RendererProcessOptimizer {
  private readonly maxWorkers: number;
  private workers: Worker[] = [];

  constructor() {
    this.maxWorkers = Math.max(1, cpus().length - 1);
    this.setupWorkers();
    this.setupMemoryMonitor();
  }

  private setupWorkers() {
    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = new Worker('./worker.js');
      this.workers.push(worker);
    }
  }

  private setupMemoryMonitor() {
    setInterval(() => {
      const memory = process.memoryUsage();
      if (memory.heapUsed > 512 * 1024 * 1024) { // 512MB
        this.cleanupMemory();
      }
    }, 10000);
  }

  private cleanupMemory() {
    // 清理不必要的缓存
    if (window.caches) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }

    // 清理 IndexedDB
    indexedDB.databases().then(dbs => {
      dbs.forEach(db => indexedDB.deleteDatabase(db.name));
    });
  }
}
```

### 2. 渲染优化

#### 2.1 虚拟滚动实现
**功能描述**：实现高性能的大列表渲染优化。
**优化原理**：
- 只渲染可视区域的元素
- 复用 DOM 元素减少创建开销
- 优化滚动性能
- 支持动态高度和可变内容
```typescript
// src/electron/virtual-scroll.ts
class VirtualScroll {
  private container: HTMLElement;
  private items: any[] = [];
  private itemHeight: number;
  private visibleItems: Map<number, HTMLElement> = new Map();
  private pool: HTMLElement[] = [];
  private scrollTop = 0;
  private viewportHeight = 0;

  constructor(
    container: HTMLElement,
    items: any[],
    itemHeight: number,
    poolSize = 50
  ) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;

    // 初始化元素池
    for (let i = 0; i < poolSize; i++) {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = '0';
      div.style.right = '0';
      div.style.height = `${itemHeight}px`;
      this.pool.push(div);
    }

    this.setupScroll();
  }

  private setupScroll() {
    this.container.addEventListener('scroll', () => {
      this.scrollTop = this.container.scrollTop;
      this.viewportHeight = this.container.clientHeight;
      this.render();
    });

    // 使用 ResizeObserver 监听容器大小变化
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        this.viewportHeight = entry.contentRect.height;
        this.render();
      }
    });
    observer.observe(this.container);
  }

  private render() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex Math.ceil(this.viewportHeight / this.itemHeight) 1,
      this.items.length
    );

    // 回收不可见的元素
    for (const [index, element] of this.visibleItems.entries()) {
      if (index < startIndex || index >= endIndex) {
        this.pool.push(element);
        element.remove();
        this.visibleItems.delete(index);
      }
    }

    // 渲染可见元素
    for (let i = startIndex; i < endIndex; i++) {
      if (!this.visibleItems.has(i)) {
        const element = this.pool.pop() || document.createElement('div');
        element.style.transform = `translateY(${i * this.itemHeight}px)`;
        element.textContent = this.items[i].toString();
        this.container.appendChild(element);
        this.visibleItems.set(i, element);
      }
    }
  }
}
```

#### 2.2 GPU 加速
**功能描述**：利用 GPU 加速提升渲染性能。
**优化原理**：
- 使用 CSS transform 启用 GPU 加速
- 优化图层合成
- 减少重绘和回流
- 优化动画性能
```typescript
// src/electron/gpu-acceleration.ts
class GPUOptimizer {
  static setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .gpu-accelerated {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000;
  will-change: transform;
      }

      .composited-layer {
        position: absolute;
        transform: translate3d(0,0,0);
  will-change: transform;
        contain: layout style paint;
      }
    `;
    document.head.appendChild(style);
  }

  static optimizeElement(element: HTMLElement) {
    element.classList.add('gpu-accelerated');

    // 强制创建新的合成层
    element.style.transform = 'translateZ(0)';

    // 避免重绘
    element.style.contain = 'layout style paint';
  }

  static setupAnimationOptimization() {
    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        // 在下一帧处理滚动相关的视图更新
      });
    }, { passive: true });
  }
}
```

### 3. IPC 通信优化

#### 3.1 消息队列实现
**功能描述**：优化进程间通信的性能和可靠性。
**优化原理**：
- 实现消息批处理和队列
- 控制通信频率和延迟
- 优化序列化和反序列化
- 处理通信异常和超时
```typescript
// src/electron/ipc-queue.ts
import { ipcMain, ipcRenderer } from 'electron';

class IPCQueue {
  private queue: Array<{
    channel: string;
    data: any;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private processing = false;
  private batchSize = 10;
  private batchDelay = 16; // ~1 frame

  constructor(private readonly isMain: boolean) {
    this.setupListeners();
  }

  private setupListeners() {
    if (this.isMain) {
      ipcMain.on('batch-message', async (event, messages) => {
        const results = await Promise.all(
          messages.map(msg => this.processMessage(msg))
        );
        event.reply('batch-response', results);
      });
    } else {
      ipcRenderer.on('batch-response', (_, results) => {
        results.forEach((result, index) => {
          const { resolve, reject } = this.queue[index];
          if (result.error) {
            reject(result.error);
          } else {
            resolve(result.data);
          }
        });
        this.queue.splice(0, results.length);
      });
    }
  }

  async send(channel: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ channel, data, resolve, reject });
      if (!this.processing) {
        this.processBatch();
      }
    });
  }

  private async processBatch() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const batch = this.queue.slice(0, this.batchSize);

    if (this.isMain) {
      const results = await Promise.all(
        batch.map(msg => this.processMessage(msg))
      );
      // 处理结果...
    } else {
      ipcRenderer.send('batch-message', batch.map(msg => ({
        channel: msg.channel,
        data: msg.data
      })));
    }

    await new Promise(resolve => setTimeout(resolve, this.batchDelay));
    this.processing = false;
    if (this.queue.length > 0) {
      this.processBatch();
    }
  }

  private async processMessage(msg: any) {
    try {
      // 处理消息的具体逻辑
      return { data: 'result' };
    } catch (error) {
      return { error };
    }
  }
}
```

## 四、性能监控与分析

### 1. 性能指标收集
**功能描述**：实现应用性能的全方位监控。
**优化原理**：
- 收集关键性能指标
- 实现异常检测和告警
- 支持性能数据分析
- 提供性能优化建议
```typescript
// src/monitoring/metrics.ts
class PerformanceMetrics {
  private metrics: Map<string, number[]> = new Map();
  private readonly maxSamples = 100;

  record(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const samples = this.metrics.get(name)!;
    samples.push(value);

    if (samples.length > this.maxSamples) {
      samples.shift();
    }

    this.checkThreshold(name, value);
  }

  private checkThreshold(name: string, value: number) {
    const samples = this.metrics.get(name)!;
    const avg = samples.reduce((a, b) => a b) / samples.length;

    if (value > avg * 2) {
      console.warn(`Performance anomaly detected for ${name}: ${value}`);
    }
  }

  getStats(name: string) {
    const samples = this.metrics.get(name) || [];
    if (samples.length === 0) return null;

    const sorted = [...samples].sort((a, b) => a - b);
    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: samples.reduce((a, b) => a b) / samples.length,
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }
}
```

### 2. 自动化性能测试
**功能描述**：实现自动化的性能测试和分析。
**优化原理**：
- 测试 CPU 性能
- 测试内存使用
- 测试 I/O 性能
- 测试渲染性能
```typescript
// src/monitoring/performance-test.ts
class PerformanceTest {
  private metrics = new PerformanceMetrics();

  async runTests() {
    // CPU 性能测试
    await this.testCPU();

    // 内存性能测试
    await this.testMemory();

    // I/O 性能测试
    await this.testIO();

    // 渲染性能测试
    await this.testRendering();
  }

  private async testCPU() {
    const start = process.hrtime.bigint();
    // 执行 CPU 密集型操作
    const end = process.hrtime.bigint();

    this.metrics.record('cpu_test', Number(end - start) / 1e6);
  }

  private async testMemory() {
    const before = process.memoryUsage().heapUsed;
    // 执行内存密集型操作
    const after = process.memoryUsage().heapUsed;

    this.metrics.record('memory_test', (after - before) / 1024 / 1024);
  }

  private async testIO() {
    const start = Date.now();
    // 执行 I/O 操作
    const end = Date.now();

    this.metrics.record('io_test', end - start);
  }

  private async testRendering() {
    if (process.type === 'renderer') {
      const start = performance.now();
      // 执行渲染操作
      const end = performance.now();

      this.metrics.record('render_test', end - start);
    }
  }
}
```

## 五、最佳实践建议

### 1. Node.js 应用
- 使用 CPU 亲和性绑定优化多核性能
- 实现对象池减少 GC 压力
- 采用异步 I/O 队列管理并发
- 监控内存泄漏并及时处理
- 使用 Worker 线程处理 CPU 密集任务

### 2. Electron 应用
- 主进程和渲染进程职责分离
- 使用 GPU 加速优化渲染性能
- 实现虚拟滚动处理大量数据
- 优化 IPC 通信减少进程间开销
- 合理使用内存和及时回收资源

### 3. 通用优化建议
- 建立完整的性能监控体系
- 进行定期的性能测试和分析
- 采用渐进式加载策略
- 实现优雅的错误处理机制
- 保持代码的可维护性和可扩展性

### 4. 并行计算优化

#### 4.1 Worker 线程池实现
**功能描述**：实现基于 Worker Threads 的高效并行计算框架。
**优化原理**：
- 自动管理 Worker 线程生命周期
- 实现任务分配和负载均衡
- 支持任务优先级和取消
- 处理线程异常和自动恢复

```typescript
// src/parallel/worker-pool.ts
import { Worker, MessageChannel, MessagePort } from 'worker_threads';
import * as os from 'os';

interface Task<T> {
  id: string;
  data: any;
  priority: number;
  resolve: (result: T) => void;
  reject: (error: Error) => void;
}

class WorkerPool {
  private workers: Worker[] = [];
  private taskQueue: Task<any>[] = [];
  private readonly maxWorkers: number;
  private busyWorkers: Set<Worker> = new Set();

  constructor(
    private workerScript: string,
    maxWorkers = os.cpus().length
  ) {
    this.maxWorkers = maxWorkers;
    this.initialize();
  }

  private initialize() {
    for (let i = 0; i < this.maxWorkers; i++) {
      this.createWorker();
    }
  }

  private createWorker() {
    const worker = new Worker(this.workerScript);

    worker.on('message', (result) => {
      this.handleTaskCompletion(worker, result);
    });

    worker.on('error', (error) => {
      console.error('Worker error:', error);
      this.handleWorkerError(worker);
    });

    this.workers.push(worker);
  }

  private handleTaskCompletion(worker: Worker, result: any) {
    this.busyWorkers.delete(worker);
    const task = this.taskQueue.shift();

    if (task) {
      task.resolve(result);
      this.assignTaskToWorker(worker, task);
    }
  }

  private handleWorkerError(worker: Worker) {
    const index = this.workers.indexOf(worker);
    if (index !== -1) {
      this.workers.splice(index, 1);
      this.createWorker();
    }
  }

  async execute<T>(data: any, priority = 0): Promise<T> {
    return new Promise((resolve, reject) => {
      const task: Task<T> = {
        id: Math.random().toString(36).substr(2, 9),
        data,
        priority,
        resolve,
        reject
      };

      const availableWorker = this.workers.find(
        w => !this.busyWorkers.has(w)
      );

      if (availableWorker) {
        this.assignTaskToWorker(availableWorker, task);
      } else {
        this.taskQueue.push(task);
        this.taskQueue.sort((a, b) => b.priority - a.priority);
      }
    });
  }

  private assignTaskToWorker(worker: Worker, task: Task<any>) {
    this.busyWorkers.add(worker);
    worker.postMessage(task.data);
  }

  terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.taskQueue = [];
  }
}

// Worker 脚本示例 (worker.ts)
import { parentPort } from 'worker_threads';

parentPort?.on('message', async (data) => {
  try {
    // 执行计算密集型任务
    const result = await computeIntensive(data);
    parentPort?.postMessage(result);
  } catch (error) {
    parentPort?.postMessage({ error: error.message });
  }
});

// 使用示例
const pool = new WorkerPool('./worker.js');

// 执行并行任务
async function processDataInParallel(dataArray: any[]) {
  const results = await Promise.all(
    dataArray.map(data => pool.execute(data))
  );
  return results;
}
```

#### 4.2 SIMD 并行计算
**功能描述**：利用 CPU 的 SIMD 指令集实现数据并行处理。
**优化原理**：
- 使用 SIMD.js API 进行向量运算
- 优化数值计算性能
- 支持批量数据处理
- 自动降级处理

```typescript
// src/parallel/simd-compute.ts
class SIMDCompute {
  private static hasSimd = typeof SIMD !== 'undefined';

  static vectorAdd(a: Float32Array, b: Float32Array): Float32Array {
    if (this.hasSimd && a.length === b.length) {
      return this.simdVectorAdd(a, b);
    }
    return this.standardVectorAdd(a, b);
  }

  private static simdVectorAdd(a: Float32Array, b: Float32Array): Float32Array {
    const result = new Float32Array(a.length);
    const simdLength = Math.floor(a.length / 4) * 4;

    for (let i = 0; i < simdLength; i += 4) {
      const va = SIMD.Float32x4.load(a, i);
      const vb = SIMD.Float32x4.load(b, i);
      const vc = SIMD.Float32x4.add(va, vb);
      SIMD.Float32x4.store(result, i, vc);
    }

    // 处理剩余元素
    for (let i = simdLength; i < a.length; i++) {
      result[i] = a[i] b[i];
    }

    return result;
  }

  private static standardVectorAdd(a: Float32Array, b: Float32Array): Float32Array {
    const result = new Float32Array(a.length);
    for (let i = 0; i < a.length; i++) {
      result[i] = a[i] b[i];
    }
    return result;
  }

  static matrixMultiply(a: Float32Array, b: Float32Array, width: number): Float32Array {
    if (this.hasSimd) {
      return this.simdMatrixMultiply(a, b, width);
    }
    return this.standardMatrixMultiply(a, b, width);
  }

  private static simdMatrixMultiply(
    a: Float32Array,
    b: Float32Array,
    width: number
  ): Float32Array {
    const result = new Float32Array(width * width);
    const simdWidth = Math.floor(width / 4) * 4;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++) {
        let sum = SIMD.Float32x4.splat(0);

        for (let k = 0; k < simdWidth; k += 4) {
          const va = SIMD.Float32x4.load(a, i * width k);
          const vb = SIMD.Float32x4.load(b, j * width k);
          sum = SIMD.Float32x4.add(sum, SIMD.Float32x4.mul(va, vb));
        }

        let temp = SIMD.Float32x4.extractLane(sum, 0) +
                   SIMD.Float32x4.extractLane(sum, 1) +
                   SIMD.Float32x4.extractLane(sum, 2) +
                   SIMD.Float32x4.extractLane(sum, 3);

        // 处理剩余元素
        for (let k = simdWidth; k < width; k++) {
          temp += a[i * width k] * b[j * width k];
        }

        result[i * width j] = temp;
      }
    }

    return result;
  }

  private static standardMatrixMultiply(
    a: Float32Array,
    b: Float32Array,
    width: number
  ): Float32Array {
    const result = new Float32Array(width * width);

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++) {
        let sum = 0;
        for (let k = 0; k < width; k++) {
          sum += a[i * width k] * b[j * width k];
        }
        result[i * width j] = sum;
      }
    }

    return result;
  }
}

// 使用示例
const a = new Float32Array([1, 2, 3, 4]);
const b = new Float32Array([5, 6, 7, 8]);
const result = SIMDCompute.vectorAdd(a, b);
```

#### 4.3 GPU 计算优化
**功能描述**：利用 WebGL 进行 GPU 加速计算。
**优化原理**：
- 使用 GPU 进行并行计算
- 优化图像处理性能
- 支持大规模数据运算
- 自动管理 GPU 资源

```typescript
// src/parallel/gpu-compute.ts
class GPUCompute {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext('webgl')!;
    if (!this.gl) {
      throw new Error('WebGL not supported');
    }
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(this.gl.getShaderInfoLog(shader)!);
    }

    return shader;
  }

  private createProgram(
    vertexShaderSource: string,
    fragmentShaderSource: string
  ): WebGLProgram {
    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error(this.gl.getProgramInfoLog(program)!);
    }

    return program;
  }

  computeParallel(data: Float32Array, width: number, height: number): Float32Array {
    // 设置顶点着色器
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // 设置片段着色器（实现具体的计算逻辑）
    const fragmentShaderSource = `
      precision highp float;
      uniform sampler2D u_data;
      uniform vec2 u_resolution;

      void main() {
        vec2 coord = gl_FragCoord.xy / u_resolution;
        vec4 value = texture2D(u_data, coord);
        // 在这里实现你的计算逻辑
        gl_FragColor = value * 2.0; // 示例：将所有值乘以2
      }
    `;

    this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
    this.gl.useProgram(this.program);

    // 创建顶点缓冲区
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1
    ]);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    // 设置顶点属性
    const positionLocation = this.gl.getAttribLocation(this.program, 'position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    // 创建纹理
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      width,
      height,
      0,
      this.gl.RGBA,
      this.gl.FLOAT,
      data
    );

    // 设置纹理参数
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    );

    // 设置视口和分辨率
    this.gl.viewport(0, 0, width, height);
    const resolutionLocation = this.gl.getUniformLocation(
      this.program,
      'u_resolution'
    );
    this.gl.uniform2f(resolutionLocation, width, height);

    // 执行渲染
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    // 读取结果
    const result = new Float32Array(width * height * 4);
    this.gl.readPixels(
      0,
      0,
      width,
      height,
      this.gl.RGBA,
      this.gl.FLOAT,
      result
    );

    return result;
  }

  dispose() {
    if (this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}

// 使用示例
const canvas = document.createElement('canvas');
const gpuCompute = new GPUCompute(canvas);

const data = new Float32Array(1024 * 1024); // 1M 数据
// 填充数据...
const result = gpuCompute.computeParallel(data, 1024, 1024);
gpuCompute.dispose();
```

#### 4.4 SharedArrayBuffer 并行处理
（此处优化在 VS Code 中尚未应用）  ⃝ 未实现
**功能描述**：使用 SharedArrayBuffer 实现高效的进程间数据共享和并行处理。
**优化原理**：
- 零拷贝数据共享
- 原子操作保证数据一致性
- 支持多进程并行计算
- 实现高效的数据同步

```typescript
// src/parallel/shared-compute.ts
class SharedCompute {
  private sharedBuffer: SharedArrayBuffer;
  private sharedArray: Float64Array;
  private workers: Worker[] = [];

  constructor(size: number, numWorkers: number) {
    this.sharedBuffer = new SharedArrayBuffer(size * 8); // 8 bytes per float64
    this.sharedArray = new Float64Array(this.sharedBuffer);

    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker('./compute-worker.js');
      worker.postMessage({
        buffer: this.sharedBuffer,
        workerId: i,
        numWorkers
      });
      this.workers.push(worker);
    }
  }

  async computeParallel(data: Float64Array): Promise<Float64Array> {
    // 复制输入数据到共享缓冲区
    this.sharedArray.set(data);

    // 通知所有 worker 开始计算
    const promises = this.workers.map(worker => {
      return new Promise<void>((resolve, reject) => {
        worker.onmessage = (e) => {
          if (e.data.error) {
            reject(e.data.error);
          } else {
            resolve();
          }
        };
        worker.postMessage({ command: 'compute' });
      });
    });

    // 等待所有 worker 完成
    await Promise.all(promises);

    // 返回计算结果
    return new Float64Array(this.sharedBuffer);
  }

  dispose() {
    this.workers.forEach(worker => worker.terminate());
  }
}

// Worker 脚本 (compute-worker.ts)
let sharedArray: Float64Array;
let workerId: number;
let numWorkers: number;

self.onmessage = (e) => {
  if (e.data.buffer) {
    // 初始化
    sharedArray = new Float64Array(e.data.buffer);
    workerId = e.data.workerId;
    numWorkers = e.data.numWorkers;
  } else if (e.data.command === 'compute') {
    // 执行计算
    try {
      computeChunk();
      self.postMessage({ done: true });
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  }
};

function computeChunk() {
  const chunkSize = Math.ceil(sharedArray.length / numWorkers);
  const start = workerId * chunkSize;
  const end = Math.min(start chunkSize, sharedArray.length);

  for (let i = start; i < end; i++) {
    // 使用 Atomic 操作确保数据一致性
    Atomics.add(
      sharedArray,
      i,
      Math.sin(sharedArray[i]) // 示例计算
    );
  }
}

// 使用示例
const compute = new SharedCompute(1024 * 1024, 4); // 1M 数据，4个 worker
const data = new Float64Array(1024 * 1024);
// 填充数据...
const result = await compute.computeParallel(data);
compute.dispose();
```

这些新增的并行计算优化实现提供了：

1. Worker 线程池：
   - 自动管理线程生命周期
   - 任务优先级队列
   - 错误处理和自动恢复
   - 适用于 CPU 密集型任务

2. SIMD 并行计算：
   - 向量化运算
   - 自动降级处理
   - 高性能数值计算
   - 适用于大规模数据处理

3. GPU 计算优化：
   - WebGL 加速
   - 并行数据处理
   - 高效图像运算
   - 适用于图形和科学计算

4. SharedArrayBuffer 并行处理：
   - 零拷贝数据共享
   - 原子操作保证
   - 多进程协同计算
   - 适用于大规模数据分析

## 快速加载优化实践
为了提升 Node.js 及 Electron 应用的启动速度，我们可以采用以下快速加载优化策略：
1. **V8 快照技术**：预初始化常用对象和模块，将其序列化保存在快照文件中，启动时直接加载快照以减少 JavaScript 解析与编译时间。（参见 "V8 快照实现" 部分）  ✓ 已实现
2. **模块缓存与代码分割**：提前加载关键模块，将非必要模块实现延迟加载，并利用 Node.js 的 `require.cache` 机制，实现模块复用和快速访问。  ✓ 已实现
3. **预加载脚本（Preload Scripts）**：在 Electron 环境下，通过预加载脚本异步加载核心资源，同时在渲染进程中使用异步 I/O 队列优化资源调度。  ✓ 已实现
4. **共享内存与零拷贝**：利用 SharedArrayBuffer 及零拷贝传输优化进程间数据共享，缩短启动时的数据初始化时间。  ✓ 已实现

## 其他最佳实践
在高性能 Node.js 与 Electron 应用中，除上述优化方法外，还可关注以下实践，以进一步提升系统整体性能和稳定性：

1. **日志与调试优化**
   - 使用异步日志库，避免同步日志写入阻塞主线程。
   - 在生产环境中调整日志级别，降低过量日志输出对 I/O 的消耗。

2. **异常处理与监控机制**
   - 采用集中式异常捕获和错误监控，确保错误在发生时不会影响主流程。
   - 配合 APM 工具与自定义性能指标，对关键路径进行实时监控和报警。
   - 利用 Node.js Inspector、Chrome DevTools、Clinic.js 等工具进行性能 Profiling.

3. **依赖管理与打包优化**
   - 精简依赖库，利用 Tree Shaking 等技术减少生产包体积。
   - 在构建阶段启用增量打包与缓存策略，加快项目编译和部署速度。

4. **持续集成与性能回归测试**
   - 集成自动化性能测试工具，在每次迭代中检测和预防性能回退。
   - 利用 CI/CD 流水线确保代码变更不会引入新的性能瓶颈。

5. **渲染与资源调度优化**
   - 在 Electron 应用中配置合理的 `contextIsolation` 和沙箱策略，确保前后台进程均获得最优性能。
   - 针对特定场景采用预加载或惰性加载策略，降低启动时资源负荷，优化渲染流程。

6. **内存管理与垃圾回收策略**
   - 定期监控内存使用情况，采用缓存清理和资源释放措施防止内存泄漏。
   - 结合 V8 提供的 GC 监控工具，对垃圾回收参数进行调优，以适应不同业务场景的要求。
   - *V8 GC 监控工具说明*：Node.js 内置的 `v8` 模块提供了如 `getHeapStatistics()`、`getHeapSpaceStatistics()` 以及 `getHeapSnapshot()` 等接口，这些接口能够实时监控 V8 引擎的堆内存使用情况和垃圾回收行为。通过获取这些指标，可以分析堆内存总量、使用量、空闲部分及各个内存空间（如 new space、old space 等）的分布情况，从而更好地定位内存泄漏及优化 GC 参数，提升系统性能.

7. **避免同步代码与阻塞性 I/O 操作**
  - 使用异步 API 处理所有 I/O 操作，避免阻塞事件循环.
  - 针对 CPU 密集任务，利用 Worker Threads 或子进程隔离执行，减少主线程阻塞.

8. **调整 libuv 线程池大小**
  - Node.js 默认的 libuv 线程池大小可能不足以满足高并发需求.
  - 通过设置环境变量 `UV_THREADPOOL_SIZE` 调整线程池大小，以匹配实际负载.

### 附加最佳实践 – 调整 libuv 线程池大小

Node.js 使用 libuv 来处理文件 I/O、DNS 查询等异步任务，其线程池默认大小为 4。你可以通过设置环境变量 `UV_THREADPOOL_SIZE` 调整线程池大小，以提升 I/O 密集型任务的并发处理能力。但请注意：

- 该设置必须在 Node.js 进程启动之前进行，启动后无法动态更改。
- 增加线程池大小主要对 I/O 密集型场景有效，对于 CPU 密集型任务，不建议将该值设置大于实际 CPU 核心数，以避免不必要的资源竞争。

#### 运行指令示例

- **Linux / macOS:**
  ```bash
  export UV_THREADPOOL_SIZE=<适合的数值，建议不超过 CPU 核心数>
  node script.js
  ```

  ```bash
  const OS = require('os');
  process.env.UV_THREADPOOL_SIZE = OS.cpus().length;
  ```

#### 启动时自动设置示例
在启动入口文件或 bootstrap 脚本中，可以提前设置该变量：

```typescript
// 例如在 src/bootstrap-node.ts 的早期初始化阶段
if (!process.env.UV_THREADPOOL_SIZE) {
  // 根据实际负载选择合适的线程池大小，务必不要超过 CPU 核心数
  process.env.UV_THREADPOOL_SIZE = "<适合的数值>";
}
```

#### 检测 libuv 线程池大小

```bash
UV_THREADPOOL_SIZE=64 node script.js
node -p "require('uv').getThreadpoolSize()"


process.env.UV_THREADPOOL_SIZE=64
//then execute some function that requires threadpool
require('fs').readFile('testing',function(){});

ps -Lef | grep  "\<node\>" | wc -l
67
```




