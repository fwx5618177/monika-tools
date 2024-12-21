# Farcaster - Extension

创建一个工具来抓取并分析 Farcaster 上的用户数据，并根据给定的积分计算逻辑评估用户的交互得分，同时实现一个基于推文交互数据的抽奖功能。以下是详细的需求分析和实现步骤：

## 功能需求

1. **用户数据抓取**

   - 输入某个用户的 Farcaster ID。
   - 收集该用户的基本信息、粉丝列表、文章（推文）等数据。

2. **积分计算**

   - 基于用户的粉丝、文章等数据，计算用户的得分。
   - 计算用户的粉丝的得分。
   - 积分计算逻辑见[文档](https://docs.google.com/document/d/1dsnWSrYd1Wkc0S34PEqsJDpbfLMJvxU_iUlXzGv_hjc/edit)：
     - 操作系数：转发为 4，点赞为 1。
     - 分数计算公式：分数 = 粉丝系数 _ 认证系数 _ 注册时间系数 _ 关注系数 _ 操作系数。

3. **推文抽奖功能**
   - 基于单一推文的交互数据进行抽奖。
   - 确定参与抽奖的用户，并根据互动数据（如点赞、转发等）进行抽奖。

## 实现步骤

1. **数据抓取**

   - 使用 Farcaster 的 API（或 Web Scraping）来获取指定用户的基本信息、粉丝列表和文章数据。
   - 收集用户互动数据，包括每篇文章的点赞数和转发数。

2. **积分计算**

   - 根据文档中的积分计算逻辑，编写积分计算函数。
   - 计算公式中的各个系数需要从用户数据中提取，例如粉丝数、认证状态、注册时间、关注数量等。

3. **推文抽奖功能**
   - 提取指定推文的互动数据，收集所有参与互动的用户列表。
   - 根据每个用户的互动类型（点赞、转发等）给予不同权重。
   - 实现抽奖算法，从互动用户中随机选出中奖者。

## 代码结构

1. **数据抓取模块**

   - 获取用户数据：`getUserData(userId)`
   - 获取粉丝列表：`getUserFollowers(userId)`
   - 获取用户文章：`getUserPosts(userId)`

2. **积分计算模块**

   - 计算粉丝系数：`calculateFollowerScore(followers)`
   - 计算认证系数：`calculateVerificationScore(verified)`
   - 计算注册时间系数：`calculateRegistrationScore(registrationDate)`
   - 计算关注系数：`calculateFollowingScore(following)`
   - 计算操作系数：`calculateActionScore(likes, reposts)`
   - 总分计算：`calculateTotalScore(user)`

3. **抽奖模块**
   - 获取推文互动数据：`getTweetInteractions(tweetId)`
   - 实现抽奖逻辑：`runLottery(interactions)`

## 参考资料

1. [Twitter 算法](https://tweethunter.io/blog/understanding-the-x-algorithm)
2. [Twitter Timeline Algorithm](https://buffer.com/library/twitter-timeline-algorithm/#how-the-twitter-algorithm-works-a-tldr-on-the-new-x-avatar)
3. [Twitter Recommendation Algorithm](https://blog.x.com/engineering/en_us/topics/open-source/2023/twitter-recommendation-algorithm)
