---
title: lua基础语法
date: 2024-5-30 10:16:53
tags:
  - lua
---

## 基础语法


### if else

> 与js不同

```lua
if (1) then
   -- 
elseif (2) then
   -- 
elseif (3) then
   --
else 
   --
end
```


### 循环

```lua
for i = 1, 10 do  -->获取参数总数
  print("index: ", i); --> 1,2,3,4,5,6,7,8,9,10  
end
```


1. goto 语句

```lua
local a = 1
::label:: print("--- goto label ---")

a = a+1
if a < 3 then
    goto label   -- a 小于 3 的时候跳转到标签 label
end
```

2. 实现continue功能

```lua
for i=1, 3 do
  if i <= 2 then
    print(i, "yes continue")
    goto continue
  end
  print(i, " no continue")
  ::continue::
  print([[i'm end]])
end

--[[
1   yes continue
i'm end
2   yes continue
i'm end
3    no continue
i'm end
]]--
```


### 函数


1. 可变参数 `...`

```lua
function add(...)  
  local s = 0  

  for i, v in ipairs{...} do   --> {...} 表示一个由所有变长参数构成的数组  
    s = s + v  
  end  
  
  return s  
end  
print(add(3,4,5,6,7))  --->25
```


2. 获取可变参数的长度 `select("#",...)`


```lua
function average(...)
   result = 0
   local arg={...}
   for i,v in ipairs(arg) do
      result = result + v
   end
   print("总共传入 " .. select("#",...) .. " 个数")
   return result/select("#",...)
end

print("平均值为",average(10,5,3,4,5,6))
```


3. select

- `select('#', …)` 返回可变参数的长度。
- `select(n, …)` 用于返回从起点 n 开始到结束位置的所有参数列表


```lua
do  
    function foo(...)  
        for i = 1, select('#', ...) do  -->获取参数总数
            local arg = select(i, ...); -->读取参数，arg 对应的是右边变量列表的第一个参数
            print("arg", arg);  
        end  
    end  
  
    foo(1, 2, 3, 4);  
end
```


### 预算符


1. 算术运算符

- ^ 乘幂
- // 整除运算符


2. 关系运算符

- ~= 不等于

3. 逻辑运算符

> 与js对应

- and 与 (即&&)
- or 或 (即||)
- not 非 (即!)

```lua
a = true
b = false
c = a and b --> false
d = a or b --> true
e = not(a and b) --> true
```

3. 其他运算符

- .. 连接字符串
- \# 一元运算符，返回字符串/表长度

```lua
a = "Hello "
b = "World"
c =  a..b -->  Hello World
len = #b --> 5
```

### 优先级


| 优先级 | 运算符          |
| ------ | --------------- |
|        | ^               |
|        | not  -(unary)   |
|        | *  /  %         |
|        | +  -            |
|        | ..              |
|        | < > <= >= ~= == |
|        | and             |
|        | or              |




### 字符串

1. 字符串拼接 `..`

```lua
print("a" .. 'b')
-- ab
print(157 .. 428)
-- 157428
```

2. 字符串长度

- \#
- string.len 只计算 ASCII 字符串
- utf8.len 包含中文的使用


> 注意 **string.len** 只计算 ASCII 字符串，包含中文的字符串不准确，包含中文的字符串使用 **utf8.len**

```lua
len = "www.runoob.com"
print(#len)
-- 14
print(#"www.runoob.com")
-- 14
print(string.len("www.runoob.com"))
--> 14
print(utf8.len("www.runoob.com"))
--> 14
print(string.len("Hello, 世界!"))
--> 14 不准确
print(#("Hello, 世界!"))
--> 14 不准确
print(utf8.len("Hello, 世界!"))
--> 10 正确
```




3. 一串字符 [[]]

```lua
local str = [[
  这是一堆字符块
  这是一堆字符块
  这是一堆字符块
  这是一堆字符块
]]
```

#### 字符串操作

- string.upper 转大写
- string.lower 转小写
- string.gsub 替换
- string.find 查找
- string.reverse 反转
- string.format 格式化
- string.len 长度
- string.rep(str, n) 拷贝n次
- string.gmatch 迭代器
- string.match 正则匹配
- string.sub 截取


1. string.gsub(mainString,findString,replaceString,replaceCount) 

字符串替换

```lua
a,b = string.gsub("aaaa","a","z",3);
---> a = zzza
---> b = 3
```

1. string.find (str, substr, [init, [plain]])

字符串查找

- init 搜索起始位置，默认为1，负数表示从后往前数
- plain 是否简单模式，默认为 false，true为简单查找，false使用正则模式匹配

```lua
-- 普通查找
a,b = string.find("Hello Lua user", "Lua", 1, true);
---> a = 7
---> b = 9

-- 正则表达式
a,b = string.find("Hello Lua user", "%w+", 1, false);

```

3. string.gmatch(str, pattern)

字符串迭代器

每次在字符串str中找到符合pattern秒速的字符子串

```lua
for word in string.gmatch("Hello Lua user", "%a+") do   
  print(word) 
end
-- Hello
-- Lua
-- user
```

4. string.match(str, pattern, init)

字符串正则匹配


```lua
string.match("I have 2 questions for you.", "%d+ %a+")
-- 2 questions

string.format("%d, %q", string.match("I have 2 questions for you.", "(%d+) (%a+)"))
-- 2, "questions"
```

5. string.sub(s, i [, j])


- s：要截取的字符串。
- i：截取开始位置。
- j：截取结束位置，默认为 -1，最后一个字符


6. string.format


字符串格式化

- %c  并将 **数字** 其转化为ASCII码对应的 **字符**
- %d, %i  接受一个数字并将其转化为有符号的整数格式
- %o  将数字转化为 **八进制** 数格式
- %u  将数字转化为 **无符号整数** 格式
- %x  将数字转化为 **十六进制数** 格式, 使用小写字母
- %X  将数字转化为 **十六进制数** 格式, 使用大写字母
- %e  将数字转化为 **科学记数法** 格式, 使用小写字母e
- %E  将数字转化为 **科学记数法** 格式, 使用大写字母E
- %f  将数字转化为 **浮点数** 格式
- %g(%G)  将数字转化为%e(%E, 对应%G)及%f中较短的一种格式
- %q  将字符串转化为可安全被Lua编译器读入的格式
- %s  按照给定的参数格式化该字符串




### 数组



1. 遍历数组

```lua
-- 创建一个数组
local myArray = {10, 20, 30, 40, 50}

-- 循环遍历数组
for i = 1, #myArray do
    print(myArray[i])
end
```

### 表


#### 操作

- table.concat 连接表
- table.insert 插入元素
- table.remove 移除元素
- table.sort 排序


1. table.concat (table [, sep [, start [, end]]]):


```lua
fruits = {"banana","orange","apple"}

-- 返回 table 连接后的字符串
print("连接后的字符串 ",table.concat(fruits))
-- 连接后的字符串     bananaorangeapple

-- 指定连接字符
print("连接后的字符串 ",table.concat(fruits,", "))
-- 连接后的字符串     banana, orange, apple

-- 指定索引来连接 table
print("连接后的字符串 ",table.concat(fruits,", ", 2,3))
-- 连接后的字符串     orange, apple
```


2. table.insert (table, [pos,] value)

```lua
fruits = {"banana","orange","apple"}

-- 在末尾插入
table.insert(fruits,"mango")

-- 在索引为 2 的键处插入
table.insert(fruits,2,"grapes")
```

3. table.remove (table [, pos])


```lua
-- 移除最后一个元素
table.remove(fruits)

-- 移除第二个元素
table.remove(fruits, 2)
```


## 协同程序


### 基本语法


- coroutine.create 创建协程
- coroutine.resume 重启
- coroutine.yield 挂起
- coroutine.wrap 创建
- coroutine.running 返回正在跑的coroutine，线程号


### 生产者-消费者


```lua
local newProductor

function productor()
     local i = 0
     while true do
          i = i + 1
          send(i)     -- 将生产的物品发送给消费者
     end
end

function consumer()
     while true do
          local i = receive()     -- 从生产者那里得到物品
          print(i)
     end
end

function receive()
     local status, value = coroutine.resume(newProductor)
     return value
end

function send(x)
     coroutine.yield(x)     -- x表示需要发送的值，值返回以后，就挂起该协同程序
end

-- 启动程序
newProductor = coroutine.create(productor)
consumer()
```



## 文件I/O


### 打开文件

file = io.open(filename [, mode])

- r 只读打开，文件必须存在
- w 只写文件，文件存在则清空，不存在创建
- a 附加打开，文件存在则追加内容，不存在则创建
- r+ 可读写，文件必须存在
- w+ 可读写，文件存在则清空，不存在创建
- a+ 文件可读写
- b 二进制文件
- + 可读可写

### 读取文件

content = io.read()

- "*n" 读取一个数字并返回它
- "*a" 从当前位置读取整个文件
- "*l"（默认）读取下一行
- number 返回一个指定字符个数的字符串


### 简单/完全模式


```lua
file = io.open("test.lua", "r")

-- 设置默认输入文件为 test.lua
io.input(file)

print("-----输出文件第一行-------")
print(io.read())

print("-----读取文件前6位字符-------")
print(io.read(6))

print("------读取每一行------")
lines = io.lines()
for v in lines do
    print(v)
end

io.close(file)

file = io.open("test.lua", "a")

-- 设置默认输出文件为 test.lua
io.output(file)
-- 在文件最后一行添加 Lua 注释
io.write("\n--  简单模式添加")

-- 关闭打开的文件
io.close(file)

-- 以附加的方式打开只写文件
file = io.open("test.lua", "a")

-- 在文件最后一行添加 Lua 注释
file:write("\n-- 完全模式添加")

print("-----完全模式-------")

for v in io.lines("test.lua") do
    print(v)
end

file:close()
```


## 链接数据库


```lua
require "luasql.mysql"

--创建环境对象
env = luasql.mysql()

--连接数据库
conn = env:connect("数据库名","用户名","密码","IP地址",端口)

--设置数据库的编码格式
conn:execute"SET NAMES UTF8"

--执行数据库操作
cur = conn:execute("select * from role")

row = cur:fetch({},"a")

--文件对象的创建
file = io.open("role.txt","w+");

while row do
    var = string.format("%d %s\n", row.id, row.name)

    print(var)

    file:write(var)

    row = cur:fetch(row,"a")
end


file:close()  --关闭文件对象
conn:close()  --关闭数据库连接
env:close()   --关闭数据库环境
```