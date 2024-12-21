---
title: 设计模式的好处、优势
tags:
  - 设计模式
  - 适配器
  - 策略模式
  - 命令模式
  - 抽象类
  - 接口
---

# TOC

# 设计模式的好处、优势

## 抽象类

是的，你的理解是正确的。抽象类通常用于以下几个方面：

1. **定义基础行为**：抽象类允许你定义一组基础行为（方法），这些行为可以在抽象类中实现（即具体方法），或者仅仅定义方法的框架（即抽象方法），而具体的实现则留给继承这个抽象类的子类。

2. **封装共通逻辑**：在抽象类中，你可以实现那些在所有或多个子类中通用的方法，这样可以避免在每个子类中重复编写相同的代码。

3. **定义模板方法**：抽象类可以包含一个或多个模板方法。模板方法是一种行为设计模式，用于在方法中定义一个算法的框架，让子类在不改变算法结构的前提下重写算法的某些特定步骤。

4. **提供接口和部分实现**：抽象类介于全接口和全具体类之间，它可以同时提供接口（通过抽象方法）和部分实现（通过已实现的方法），这为子类的设计提供了更大的灵活性。

### 示例

假设有一个游戏中的角色，所有角色都有一些共同的行为，比如移动（move）和攻击（attack），但具体的攻击方式可能因角色的种类而异。

```typescript
abstract class Character {
  abstract attack(): void;

  move() {
    console.log("Moving along the path...");
  }
}

class Warrior extends Character {
  attack() {
    console.log("Swinging a sword!");
  }
}

class Archer extends Character {
  attack() {
    console.log("Shooting an arrow!");
  }
}
```

在这个例子中：

- `Character` 是一个抽象类，它定义了所有角色的共同行为 `move()`，并提供了一个实现。它还定义了一个抽象方法 `attack()`，没有提供实现，这意味着任何继承自 `Character` 的类都必须实现 `attack()` 方法。
- `Warrior` 和 `Archer` 类继承自 `Character`，根据其角色特性具体实现了 `attack()` 方法。

通过这种方式，抽象类提供了一个公共的基础，确保所有角色都可以移动，并定义了一个框架，即所有角色都必须具备攻击的能力，但具体的攻击行为则由各个子类根据自己的特性来实现。这样做减少了代码冗余，增强了代码的可维护性，并提高了扩展性。

## 接口

## 适配器

为了展示适配器模式的工作方式，并验证新旧系统都能正常运行，我们可以通过编写一些简单的代码来模拟这两种情况：一种是直接使用旧的日志系统，另一种是通过适配器使用新的日志系统。这将帮助你看到适配器是如何使旧接口能够与新系统协同工作的。

### 1. 直接使用旧的日志系统

首先，我们模拟旧的日志系统的工作方式。这里我们将创建一个实现了旧日志接口的类。

```typescript
// LegacyLogger.ts
export interface LegacyLogger {
  log(message: string): void;
}

// SimpleLegacyLogger.ts
export class SimpleLegacyLogger implements LegacyLogger {
  log(message: string): void {
    console.log("Legacy Logger: " + message);
  }
}
```

### 2. 使用适配器与新日志系统

接下来，使用适配器来允许旧系统利用新的日志系统进行日志记录。

```typescript
// NewLogger.ts
export class NewLogger {
  logToConsole(obj: { message: string }): void {
    console.log("New Logger: " + obj.message);
  }
}

// LoggerAdapter.ts
import { LegacyLogger } from "./LegacyLogger";
import { NewLogger } from "./NewLogger";

export class LoggerAdapter implements LegacyLogger {
  private newLogger: NewLogger;

  constructor() {
    this.newLogger = new NewLogger();
  }

  log(message: string): void {
    this.newLogger.logToConsole({ message });
  }
}
```

### 运行和测试

现在我们可以写一段代码来模拟旧系统和新系统通过适配器的使用场景。

```typescript
import { SimpleLegacyLogger } from "./SimpleLegacyLogger";
import { LoggerAdapter } from "./LoggerAdapter";

// 使用旧的日志系统
const oldLogger = new SimpleLegacyLogger();
oldLogger.log("This is an old system without any adapter.");

// 使用适配器和新的日志系统
const adaptedLogger = new LoggerAdapter();
adaptedLogger.log("This is using the new system via an adapter.");

// 输出将显示:
// Legacy Logger: This is an old system without any adapter.
// New Logger: This is using the new system via an adapter.
```

这个例子展示了旧系统可以继续使用原有的日志方法，而新的日志系统则通过适配器被旧系统使用，而无需对旧代码进行任何修改。这正是适配器模式的优点所在：允许不兼容的接口之间进行交互，而不需要改变它们自身的代码。

确保在项目中安装了 TypeScript 的编译环境，并适当配置 `tsconfig.json`，然后你可以使用 `tsc` 命令来编译 TypeScript 代码，并使用 Node.js 运行 JavaScript 代码来查看实际的输出。如果你的项目中还没有设置 TypeScript，可以参考 TypeScript 官方文档来设置编译环境。

## 策略模式
