# Syrupal

## 技术面

- 并发和并行的区别
- 并发传数据还是信号量
- go 的 GMP 内存模型
- go 的工作窃取：本地队列是尾部，公共队列是头部
- 空白协程的大小 -> 2KB
- hashmap 有序无序？如何有序遍历
- 切片和数组的区别
- string 的底层结构，指针指向底层数组
- 协程实现切片元素的平方和

```go
package main

import (
	"fmt"
	"sync"
)

func square(wg *sync.WaitGroup, numbers <-chan int, results chan<- int) {
	defer wg.Done()
	for num := range numbers {
		results <- num * num
	}
}

func main() {
	queue := []int{1, 2, 3, 4, 5}

	var wg sync.WaitGroup

	// 传递数字
	numbers := make(chan int, len(queue))
	// 收集结果
	results := make(chan int, len(queue))

	// 启动指定的goroutine
	for i := 0; i < 2; i++ {
		wg.Add(1)

		go square(&wg, numbers, results)
	}

	// 任务分发
	for _, num := range queue {
		numbers <- num
	}

	// 关闭掉 channel
	close(numbers)

	// 等待所有完成
	wg.Wait()
	close(results)

	// 计算总和
	sum := 0
	for result := range results {
		sum += result
	}

	fmt.Println("总平方和：", sum)
}
```

## 业务面

1. 介绍架构:
   1. 网关:
      1. 风控、鉴权、限流、熔断、降级，与运维共同维护，运维管理 block list
      2. 安全: 防止 DDOS、CC 攻击，对外隐藏真实路由地址
   2. 注册中心
   3. 出入金服务
      1. 资金存取-前端
      2. 验证和执行: 身份检查、余额、风控
      3. 区块链交互:
         1. brc20 -> erc20 跨链桥: 主要使用 Rust，使用 TapRoot 协议，使用哈希时间锁定
      4. 记录报告
         1. 报表、审计
   4. 风控
      1. 验证身份: Kyc， 反洗钱、交易监控(大额交易、高频交易)
      2. 杠杆、借贷: 审核身份、资质、额度、风险
      3. 系统安全
   5. 交易撮合:
      1. 订单簿管理: 买、卖订单，策略是价格优先，时间优先
         1. 订单按价格排序，买单按降序排列，卖单按升序排列。价格相同的订单一般按时间优先排序。
      2. 订单类型: 限价、市价
         1. 限价单: 买单的价格通常低于当前市价，卖单的价格通常高于当前市价
         2. 市价单: 以当前市场上可用的最佳价格执行交易
      3. 撮合引擎: 匹配买卖订单。当买单的价格等于或高于卖单价格时，撮合引擎执行交易
         1. 接收订单：撮合引擎接收用户提交的买卖订单。
         2. 价格匹配：
            - 对于市价单，选择订单簿中的最佳可用价格。
            - 对于限价单，查找能满足设定价格条件的对手方订单。
         3. 数量匹配：根据买卖双方订单的数量进行匹配。如果一个订单的数量大于对手方订单，剩余部分继续在订单簿中等待匹配。
         4. 交易执行：一旦找到匹配，交易执行。买卖双方的账户相应更新，订单簿也进行更新。
         5. 部分成交：如果一个订单只有部分能够匹配，它可能部分成交，剩余部分继续待在订单簿。
      4. 交易执行: 一旦撮合成功，交易被执行。此过程包括更新订单簿和通知买卖双方
   6. 撮合策略: 价格优先，对于同一价格的订单，先到的订单优先成交。
      1. 存在问题:
         1. 高延迟问题，尤其在面向高频交易的场景下，高延迟会导致交易成本的增加，最后重构
         2. 同步问题:
            1. 交易顺序: 需要同步处理，以确保交易的顺序性和一致性，但是交易量巨大，同步处理可能导致处理瓶颈，影响系统的响应时间
            2. 资产余额更新：精确性和一致性，避免由于并发导致的余额不一致问题，高频更新操作可能导致数据库的瓶颈
         3. 订单状态通知采用异步，在高流量情况下，消息队列或推送服务有性能瓶颈
2. 撮合引擎的价格匹配用什么算法？
   1. 买卖订单进行匹配，价格优先，时间优先
   2. 实现细节:
      1. 撮合引擎维护一个订单簿，记录所有待匹配的买卖订单：买单按价格降序排列，卖单按价格升序排列
      2. 匹配过程:
         1. 自己设计：遍历订单簿，根据价格时间优先原则匹配买卖订单，一旦找到匹配的订单，执行交易，并更新订单簿。匹配的数据结构是红黑树
         2. 实际：直接找队列头部的对手订单是不是能匹配。能匹配就匹配，不能匹配看订单类型，time in force，如果市场价，ioc，fok 之类的撤单，否则加入订单 bu
            1. 原因： **已经按照顺序排好了，都在头部，直接找头部的订单，不需要遍历**
      3. 推荐阅读: [撮合引擎的设计与实现](https://www.infoq.cn/article/2017%2F08%2Fmatch-engine-design-and-implementation)
   3. 自己设计: FIFO，完全基于时间序列
   4. 专业撮合算法: 考虑优化流动性、减少市场冲击的撮合算法
3. 假设是一个数组，是 n 的有序数组，找到一个匹配的数字，用什么的匹配算法？
   - 二分法，哈希表、跳表和红黑树
4. 在交易撮合的模块，最亮眼的是什么，为什么这么做，达到什么效果？
   - 高延迟的优化
     - 原因:
       - 用户侧延迟过高，导致用户体验差，交易成本高
       - 无法满足快速交易
       - 处理能力瓶颈，无法有效处理大量订单，重构以提高吞吐量
     - 优化内容:
       - 代码优化: 优化代码以减少 CPU 周期，包括避免不必要的内存分配
       - 优化算法: 减少不必要的计算和数据处理，使用高效的数据结构来存储和处理数据，例如哈希表、跳表或 B 树
5. 解耦实现低延迟优化的原因？
   1. 异步通信：在订单提交和撮合过程中使用异步通信机制，避免阻塞操作
   2. 分离功能：订单接收、验证、撮合和执行等功能模块化，使每个模块可以独立运行和优化
   3. 评价: 开评审会，在业务需求的要求下开始进行重构和解耦。RT 本来会拉长，但实际上得到了降低
6. aes 是对称加密吗？
   1. 是
   2. 针对 AES-CBC-256 的升级: BFF layer 的升级，底层用了 Egg.js 的框架加密，与 Java 的网关不对齐，网关替换 BFF 的信令请求，由网关统一加密
7. mysql 的 innodb 的底层索引？
   1. B+ 树
   2. 在 B+树中，所有记录都存储在叶子节点，内部节点只存储键值和指向子节点的指针。这种结构使得范围查询变得高效
8. 本地服务器的服务运行导致 CPU 的负载高，会影响到 db 服务器的链接吗？

   1. 不会，但它可能间接导致多种问题，从而影响到与数据库服务器的连接和交互
   2. 网络延迟，链接超时

9. 写一个 Sql:
   - 有一个 Student 表，存在列:user_name,course_name,score,求数据成绩最高的学生姓名

```sql
SELECT user_name
FROM student
WHERE score = (SELECT MAX(score) FROM student);
```

10. 求数学成绩最高的学生姓名

```sql
SELECT user_name
FROM student
WHERE course_name = 'Math' AND score = (
    SELECT MAX(score)
    FROM student
    WHERE course_name = 'Math'
);
```

11. 优化:

```sql
SELECT user_name
FROM student
WHERE course_name = 'Math'
ORDER BY score DESC
LIMIT 1;
```

12. 加什么索引好？
    1.  course_name 和 score 组合索引
        1. 单列索引对单列的优化
        2. 组合索引同时优化过滤和排序操作

索引:

```sql
CREATE INDEX idx_course_score ON student (course_name, score DESC);
```

- 根据 course_name 进行索引，然后在每个课程内部根据 score 降序索引

13. 平常业务处理，假设收到报警，服务连不上 mysql，怎么排查问题？

    1. 检查网络连接
    2. 检查 MySQL 服务状态，是不是 down 了
    3. 连接限制检查，是否超过了最大连接数
    4. 查看日志文件

14. 写个回文串，求最长的字串算法

```go
package main

import "fmt"

func expandAroundCenters(s string, left int, right int) string {
	for left >= 0 && right < len(s) && s[left] == s[right] {
		left--
		right++
	}

	return s[left+1 : right]
}

func findLongestStr(s string) string {
	if len(s) < 1 {
		return ""
	}

	longest := ""

	for i := 0; i < len(s); i++ {
		p1 := expandAroundCenters(s, i, i)

		if len(p1) > len(longest) {
			longest = p1
		}

		p2 := expandAroundCenters(s, i, i+1)
		if len(p2) > len(longest) {
			longest = p2
		}
	}

	return longest
}

func main() {
	testStr := "aabbccbbaa"

	fmt.Println("Longest child string:", findLongestStr(testStr))
}
```

15. 时间复杂度是？如何优化？
    1.  最长回文子串的问题本质上涉及到检查字符串中的所有可能的子串，以确定它们是否为回文
    2.  上述代码是: O(n^2)
    3.  优化:
        1.  ❌: 二分法 -> 回文字符串 -> 不涉及到在有序集合中查找特定值，不符合二分查找法的应用场景
        2.  ❌: 快慢指针 -> 主要用于解决如环检测、寻找链表中点等问题，线性遍历，允许通过指针速度的差异找到解
        3.  ✅: Manacher 算法 -> O(n) -> 最优算法
            1.  利用已知的回文信息来加速后续的回文判断，从而避免重复检查
