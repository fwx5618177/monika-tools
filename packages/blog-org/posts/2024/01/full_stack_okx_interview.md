# OKX

1. 撮合引擎
   1. 交易撮合
      1. 订单簿
      2. 订单类型
      3. 撮合引擎
      4. 交易执行
   2. 出入金处理
      1. 资金存取
      2. 验证和执行
      3. 区块链交互
      4. 记录和报告
   3. 风控
      1. 用户 KYC、AML
      2. 杠杆、借贷限制
      3. 资金流动监控
      4. 交易系统安全: DDOS、CC 攻击
2. 撮合引擎匹配订单
   1. 订单簿买、卖订单，价格优先，时间优先，买降序，卖升序
   2. 订单类型:
      1. 限价: 交易的具体价格, 买单价格低于市价，卖单价格高于市价
      2. 市价: 以市场上可用的最佳价格执行交易
   3. 撮合过程:
      1. 接收订单: 撮合引擎接收用户提交的买卖订单
      2. 价格匹配:
         1. 市价单: 选择订单簿中的最佳可用价格
         2. 限价单: 查找能满足设定价格条件的对手方订单
      3. 数量匹配: 根据买卖双方订单的数量进行匹配。如果一个订单的数量大于对手方订单，剩余部分继续在订单簿中等待匹配
      4. 交易执行: 一旦找到匹配，交易执行。买卖双方的账户相应更新，订单簿也进行更新
      5. 部分成交: 如果一个订单只有部分能够匹配，它可能部分成交，剩余部分继续待在订单簿
   4. 撮合策略:
      1. 价格优先，对于同一价格的订单，先到的订单优先成交
3. 合约角度，挂限价单何时会作为 maker
   1. Maker: 挂单方, 通过限价单挂单，等待被成交的流动性交易者。订单没有立即与现有订单成交，而是进入订单簿中等待其他交易者与之匹配，就是一个 maker
   2. Taker: 吃单方, 通过市价单或与订单簿中现有限价单直接成交的交易者. 订单立即与订单簿中的现有订单成交，就是一个 taker
   3. 限价单成为 Maker 的情况:
      1. 订单价格不匹配：订单将进入订单簿，等待与未来的订单匹配
      2. 部分匹配：只有部分立即与订单簿中的订单匹配，剩余部分则进入订单簿。部分立即成交的数量是 taker，而对于剩余未成交的数量则是 maker
4. 维护代码过程中的水平不一致，该怎么维护系统，保证代码可维护性？
   1. 代码规范
   2. 代码审查
   3. CICD， automatic test
   4. doc
5. TDD 推行
   1. 给出测试 case
   2. 开发人员根据测试 case 进行开发
      1. 前端 Jest TDD, Cypress -> E2E
   3. CICD 中健康监测
6. Go 过多使用异步的风险
   1. 内存占用过多
   2. 资源竞争
7. 交易所什么场景会使用同步或者异步，为什么会让 cpu 负载过高
   1. 同步处理: 撮合引擎通常需要同步处理，以确保交易的顺序性和一致性
   2. 同步处理: 更新用户的账户余额时需要精确性和一致性，避免由于并发导致的余额不一致问题
   3. 异步处理: 如果通知系统处理不及时，可能会导致用户接收到延迟信息
   4. CPU 负载: 高频交易，高并发，高延迟，同步阻塞，导致 CPU 负载过高，可以改造成事件驱动
8. sol 的变量描述关键字:
   1. storage: 持久化存储，写入区块链
   2. memory: 临时存储，函数执行完毕后，数据被清除
   3. calldata: 函数参数，只能读取，不能修改
9. 跨链桥的原理:
   1. 锁定资产: 哈希锁定，多签名钱包
   2. delayer 监测
   3. 触发合约解锁资产
   4. 回调监测对比
   5. 记录返回
10. 以太坊的交易执行，交易签名和验签名是什么？
    1. 交易签名: 交易发送者使用私钥对交易进行签名，以证明交易发送者的身份 -> ECDSA
    2. 交易验签: 交易接收者使用发送者的公钥对交易进行验签，以验证交易的合法性
11. 具体签名验证的逻辑
    1. 签名过程:
       1. 创建交易
       2. 哈希交易，Keccak-256 哈希算法
       3. 私钥签名,提供一对数据 r，s 和恢复参数 v
    2. 验证签名:
       1. 提取公钥和交易哈希, ECDSA + v 提取公钥
       2. 公钥计算地址，是公钥的 Keccak-256 哈希的最后 20 个字节
       3. 验证地址和交易发送者是否一致
12. 前端:
    hook 达到目标了吗

```react
function A() {
	const config = {
		name: 'ngnice'
	}
	const fullname = useMemo(()=> {
		return config.name + 'alo'
	}, [config])
	...
}
```

- 无效。config 是一个对象，每次 A 组件渲染时都会重新创建，useMemo 会在每次组件渲染时重新计算 fullname

```react
const config = {
    name: 'ngnice'
};

function A() {
    const fullname = useMemo(() => {
        return config.name + 'alo';
    }, [config]);
    ...
}
```

13. useMemo 判断发声变化，用的是什么 api?
    1.  raw value: ===判断
    2.  引用类型: 比较地址
14. react 更新流程
    1.  触发更新
    2.  componentWillReceiveProps, shouldComponentUpdate
    3.  vdom render
    4.  vdom diff
    5.  vdom patch and update
    6.  componentDidUpdate, hook
    7.  子组件更新
15. 父子组件嵌套，父亲变化，子组件更新会触发什么更新顺序
    1.  父组件更新
    2.  父组件 componentDidUpdate, shouldComponentUpdate
    3.  父组件 render
    4.  子组件 props 更新
    5.  子组件 componentDidUpdate, shouldComponentUpdate
    6.  子组件 render -> 先子后父
    7.  vdom diff
    8.  componentDidUpdate, hook
16. [({})]，写一个 js 算法匹配这个符号

```js
function isBalanced(s) {
  let stack = [];
  const pairs = {
    "(": ")",
    "[": "]",
    "{": "}",
  };

  for (let i = 0; i < s.length; i++) {
    let char = s[i];

    // 如果是开放括号，压入栈
    if (pairs[char]) {
      stack.push(char);
    }
    // 如果是闭合括号，检查是否匹配栈顶元素
    else {
      let last = stack.pop();
      if (pairs[last] !== char) {
        return false;
      }
    }
  }

  // 检查是否所有的括号都被匹配
  return stack.length === 0;
}

console.log(isBalanced("([{}])")); // 应该输出 true
console.log(isBalanced("([{]})")); // 应该输出 false
```

17. 如果我要动态的处理 pair 呢？

```js
function isBalanced(s, pairs) {
  let stack = [];
  let openingBrackets = new Set(Object.keys(pairs));

  for (let i = 0; i < s.length; i++) {
    let char = s[i];

    // 如果是开放括号，压入栈
    if (openingBrackets.has(char)) {
      stack.push(char);
    }
    // 如果是闭合括号，检查是否匹配栈顶元素
    else {
      let last = stack.pop();
      if (pairs[last] !== char) {
        return false;
      }
    }
  }

  // 检查是否所有的括号都被匹配
  return stack.length === 0;
}

// 示例：使用不同的括号对
let pairs1 = { "(": ")", "[": "]", "{": "}" };
console.log(isBalanced("([{}])", pairs1)); // 应该输出 true

let pairs2 = { "<": ">", "(": ")" };
console.log(isBalanced("<(>)", pairs2)); // 应该输出 true

console.log(isBalanced("<[>]", pairs2)); // 应该输出 false
```
