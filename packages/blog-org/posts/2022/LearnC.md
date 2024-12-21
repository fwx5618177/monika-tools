---
id: 6f0f6384-66cc-40a7-9ef0-a1fee890381d
title: Learn C
slug: 8d6fcac3cc737df5616b1b0d99f941
isSticky: true
cover: "https://picsum.photos/950/300"
status: upload
type: article
language: 中文
description: 学习C的过程和教程
excerpt: 一些简单的介绍
name: moxi
tags:
  - C
  - C tutorial
addition:
  - C
---

# GuideToC

## 简单介绍

- [ ] 算法
- [ ] 计算机网络
- [ ] tcp/ip 协议栈
- [ ] 操作系统
- [ ] 进程和线程 并发 和锁 内存分布调度
- [ ] 设计模式
- [ ] Linux OS
- [ ] CMake
- [ ] gcc, gdb, makefile
- [ ] OS API
- [ ] 多线程编程
- 网络编程（unix 环境高级编程）（Linux 高性能服务器编程）（posix 多线程程序设计）
- [ ] 网络编程

## 推荐书籍

C： C Primer Plus, C 和指针，C 专家编程
C++：有专门的视频
基础四大件： 1.数据结构与算法 《大话数据结构》c/c++ ，《算法第四版》 java ，《剑指 offer》 2.计算机网络《tcp/ip 详解》 3.操作系统 《深入理解操作系统》 4.设计模式 《大话设计模式》
1.linux 使用
《linux 就该这么学》 2.编译和调试
GUN 官方 GCC 和 GDB 文档
《debugging with gdb 》中文版
《跟我一起写 makefile》陈皓
3.linux 环境编程
《unix 环境高级编程》
《linux 高性能服务器编程》
《posix 多线程程序设计》

## 推荐学习

### Modern C++

这应该是 C++后台开发岗位的学习路线。C++本身推荐以下学习路线：
老三件 C++ Primer 5th、effective c++，stl 源码剖析
C++2.0：effect modern c++，c++模板编程第二版，工程上《深入应用 C++11--代码优化与工程级应用》这本书基于 C++11 给了实践例子。现在 vs 默认都 C++17 了，里面有些东西在新标准下有改变。
C++14/C++17 暂时没见到有比较好的书籍，cppreference 和标准文档参考一起看比较好。之前摸了篇 17 的 foler expression https://www.cnblogs.com/pusidun/p/13608761.html，其他的有空写
此外，C++的惯用法也要知道，常见的比如 RAII，CRTP，PIMPL 等。这需要对编译、链接过程有清楚的认识，才好理解这些惯用法的意义。
建议 OS，network 基础课一定要学扎实，不然到后期很难理解一些概念。
建议最少也要使用支持 C++14 的编译器开始学习，只学 C98 当然能找到工作，但据我观察 modern c++一行不会写的同事水平比较一般，要么潜力一般要么热情一般吧。
上面这些能够让你入门 C++。如果只是想找工作，不一定需要看。我写这些只是针对学习 C++而言。毕竟 C++岗位的工作，平时很可能是用 Golang，而且很可能是 GCC4.8 以下的祖传编译器

### 操作系统 - 分布式

1. 《深入理解计算机系统》，重点做完 lab
2. MIT6.828 operating system engineering，重点做完 lab，能构造一个简单的内核
3. MIT6.824 Distributed system，分布式系统课程，现在的版本是 go 语言实现的，老版本是 c++
