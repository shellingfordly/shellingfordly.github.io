---
title: 一些unity中的问题
date: 2025-02-18 18:48:00
tags:
  - unity
---

## Program.cs

让我逐段分析 `Program.cs` 的代码：

### 1. 主函数初始化

```csharp
static void Main(string[] args)
{
	// 从命令行参数获取服务器ID，默认为1
	var serverId = args.Length > 0 ? int.Parse(args[0]) : 1;

	// 初始化服务器Host
	Host.Initialize(serverId);

	// 设置线程池最小线程数为100
	ThreadPool.SetMinThreads(100, 100);

	// 根据服务器角色选择不同的设置
	if (Host.HasRole(ServerRole.Ping))
	{
		SetupPingServer();
	}
	else
	{
		SetupGameServer();
	}

	Host.Start();
}
```

这部分代码负责服务器启动初始化，包括：

- 设置服务器ID
- 初始化Host
- 配置线程池
- 根据服务器角色选择启动模式

### 2. Ping服务器设置

```csharp
static void SetupPingServer()
{
	Host.StartNetwork = () =>
	{
		//开启web服务
		WebServer.Start();

		//开启tcp服务
		TransportServer.BindService(new TcpHostService());
		TransportServer.BindService(new KcpHostService());
		TransportServer.Start("0.0.0.0", Host.Node.Port);
	};

	Host.StopNetwork = () =>
	{
		//关闭tcp服务
		TransportServer.Stop();

		//关闭web服务器
		WebServer.Stop();
	};
}
```

Ping服务器的设置比较简单：

- 启动Web服务
- 启动TCP和KCP服务
- 提供网络服务关闭的清理函数

### 3. 游戏服务器设置

```csharp
static void SetupGameServer()
{
	// 启动前初始化
	Host.BeforeStart = () =>
	{
		MetaTable.Instance.ExternalInitializeList.Add(ExecutorMetaService.Register);
	};

	// 配置初始化
	Host.StartConfiguration = () =>
	{
		//服务器时间偏移
		ServerTime.DateHours = ConfigService.DateHours.Value;
		//加载所有配置
		ConfigLoader.LoadAll();
		//注册rpc
		RpcProxy.ExtServices.Add(Game.Service.Rpc.GameRpcService.BindService(new Game.Service.Rpc.GameRpcServer()));
	};

	// 网络服务启动
	Host.StartNetwork = async () =>
	{
		// 按顺序启动各个服务
		ConfigService.Start();
		await ServerManager.Start();
		LoginService.Start();
		await Services.Start();

		// 启动定时器
		_ = Scheduler.Start();

		// 启动Web服务
		WebServer.Start();

		// 启动TCP服务器（如果配置了端口）
		if (Host.Node.Port > 0 && Host.Transport == Framework.Core.Config.TransportType.Tcp)
		{
			TransportServer.BindService(new TcpHostService());
			TransportServer.Start("0.0.0.0", Host.Node.Port);
		}
	};

	// 网络服务停止
	Host.StopNetwork = () =>
	{
		// 记录线程池状态
		ThreadPool.GetMinThreads(out int minWork, out _);
		ThreadPool.GetMaxThreads(out int maxWork, out _);
		ThreadPool.GetAvailableThreads(out int avalidWork, out _);
		Logger.LogWarning($"ThreadPool Min[{minWork}] Max[{maxWork}] Avalid[{avalidWork}] Current[{ThreadPool.ThreadCount}]");

		// 按顺序关闭服务
		TransportServer.Stop();
		WebServer.Stop();
		LoginService.Stop();
		ServerManager.Stop();
	};
}
```

游戏服务器设置包含多个阶段：

1. **启动前初始化**

   - 注册元数据服务

2. **配置初始化**

   - 设置服务器时间
   - 加载配置
   - 注册RPC服务

3. **网络服务启动**

   - 启动配置服务
   - 启动服务器管理器
   - 启动登录服务
   - 启动游戏服务
   - 启动定时器
   - 启动Web服务
   - 启动TCP服务（如果配置了的话）

4. **网络服务停止**
   - 记录线程池状态（用于调试）
   - 按顺序关闭各个服务

这是一个典型的游戏服务器架构，提供了：

- 配置管理
- RPC通信
- 多种网络协议支持（TCP/KCP）
- Web服务
- 定时任务
- 完整的服务生命周期管理

代码结构清晰，启动和关闭顺序明确，体现了良好的工程实践。

## Host这个类是干嘛的，Host.Initialize(serverId)是初始化什么

从之前看到的代码，让我详细解释一下 `Host` 类的作用：

`Host` 类是整个游戏服务器的核心管理类，负责服务器的生命周期和配置管理。主要功能包括：

### 1. 核心属性

```csharp
public class Host
{
	// 服务器标识
	public static int ServerId { get; private set; }
	public static int GroupId { get; private set; }
	public static int Index { get; private set; }

	// 服务器角色和配置
	public static List<ServerRole> Roles { get; private set; }
	public static TransportType Transport { get; private set; }
	public static ServerNode Node { get; set; }

	// 服务器状态
	public static bool Ready => Node.Ready;
	public static bool IsRunning { get; set; } = true;
}
```

### 2. 生命周期钩子

```csharp
// 各个阶段的回调函数
public static Action BeforeStart { get; set; }
public static Action StartNetwork { get; set; }
public static Action StartConfiguration { get; set; }
public static Action BeforeStop { get; set; }
public static Action StopNetwork { get; set; }
```

### 3. `Host.Initialize(serverId)` 的初始化流程

```csharp
public static void Initialize(int serverId)
{
	// 设置服务器ID
	ServerId = serverId;

	// 初始化日志系统
	LoggerManager.Initialize();

	// 加载服务器节点配置
	var nodes = ConfigManager.LoadConfig<NodesConfig>();
	var node = nodes.Nodes[serverId];

	// 配置未捕获的任务异常处理
	TaskScheduler.UnobservedTaskException += HandleUnobservedTaskException;

	// 更新服务器配置
	Update(node);
}
```

主要完成：

1. 设置服务器唯一标识
2. 初始化日志系统
3. 加载服务器配置
4. 设置异常处理
5. 更新服务器节点信息

### 4. 重要功能

1. **服务器角色管理**

```csharp
public static bool HasRole(ServerRole role)
public static bool HasAnyRole(params ServerRole[] roles)
```

2. - _服务器重定向 _ \*（用于服务器合并）

```csharp
public static bool RunLocally(int serverId)
public static int FindRedirectServerId(int serverId)
```

3. - _服务器启动流程 _ \*

```csharp
public static void Start()
{
	InternalStart();  // 启动服务
	RunWait().Wait(); // 等待运行
	InternalStop();   // 停止服务
}
```

### 使用场景

在 `Program.cs` 中的使用展示了 `Host` 的核心作用：

```csharp
static void Main(string[] args)
{
	// 初始化服务器
	var serverId = args.Length > 0 ? int.Parse(args[0]) : 1;
	Host.Initialize(serverId);

	// 根据服务器角色配置不同的服务
	if (Host.HasRole(ServerRole.Ping))
	{
		SetupPingServer();
	}
	else
	{
		SetupGameServer();
	}

	// 启动服务器
	Host.Start();
}
```

总的来说，`Host` 类是：

1. 服务器的核心管理类
2. 负责整个服务器的生命周期
3. 管理服务器配置和状态
4. 提供服务器角色管理
5. 协调各个服务的启动和停止
6. 提供服务器间的通信和重定向支持

这是一个典型的游戏服务器架构中的核心组件，通过它可以统一管理和控制服务器的各个方面。

## 在服务器角色为ServerRole.Ping的服务器上，Host执行了StartNetwork之后就会执行StopNetwork停掉tcp服务，对吧

在服务器角色为 `ServerRole.Ping` 的情况下，`Host` 类的 `StartNetwork` 方法会被调用来启动网络服务。具体流程如下：

### 1. 启动网络服务

在 `SetupPingServer` 方法中，`Host.StartNetwork` 被定义为一个委托，执行以下操作：

```csharp
Host.StartNetwork = () =>
{
    // 开启web服务
    WebServer.Start();

// 开启tcp服务
TransportServer.BindService(new TcpHostService());
TransportServer.BindService(new KcpHostService());
TransportServer.Start("0.0.0.0", Host.Node.Port);
};
```

这段代码会启动 Web 服务和 TCP/KCP 服务。

### 2. 停止网络服务

当需要停止网络服务时，`Host.StopNetwork` 被调用，执行以下操作：

```csharp
Host.StopNetwork = () =>
{
    // 关闭tcp服务
    TransportServer.Stop();

// 关闭web服务器
WebServer.Stop();
};
```

这段代码会停止 TCP 服务和 Web 服务。

### 总结

因此，在 `ServerRole.Ping` 的服务器上，`Host` 确实会在执行 `StartNetwork` 启动网络服务后，随后执行 `StopNetwork` 来关闭 TCP 服务。这种设计通常用于处理特定的网络请求或监控，而不需要持续运行 TCP 服务。

## 那是不是说ServerRole.Ping这个服务器在开始的时候就只是确保连接通信正常即可

### `ServerRole.Ping` 服务器的主要目的

- **连接测试**：`ServerRole.Ping` 服务器的主要功能是确保与其他服务器或客户端的连接正常。这通常用于健康检查或连接验证。
- **轻量级服务**：由于其角色的特殊性，`Ping` 服务器不需要处理复杂的游戏逻辑或大量的网络请求，因此其实现相对简单。
- **快速响应**：它可以快速响应来自其他服务器或客户端的请求，以确认网络连接的可用性。

### 工作流程

1. **启动网络服务**：在 `StartNetwork` 中启动 Web 服务和 TCP/KCP 服务。
2. **处理请求**：在运行期间，它可能会处理一些简单的 ping 请求，返回连接状态。
3. **停止服务**：在不再需要时，立即停止 TCP 服务和 Web 服务。

### 总结

因此，`ServerRole.Ping` 服务器的设计确实是为了确保连接通信正常，提供一种轻量级的方式来验证网络状态，而不涉及复杂的业务逻辑或数据处理。

## 在BonusService这个服务中，服务角色添加了ServerRole.Ping，也就是说，在Program启动时，就是尝试ping BonusService这个服务，查看是否连接顺利

### `BonusService` 中的 `ServerRole.Ping`

在 `BonusService` 中添加 `ServerRole.Ping` 角色意味着该服务在启动时会被视为一个可以进行连接测试的服务。具体来说：

1. **角色定义**：

   - `ServerRole.Ping` 角色的存在使得 `BonusService` 可以在网络中被用作连接测试的目标。

2. **启动时的行为**：

   - 当 `Program` 启动时，`Host` 会检查当前服务器的角色。如果角色包括 `ServerRole.Ping`，则会调用 `SetupPingServer` 方法。
   - 在 `SetupPingServer` 中，`Host.StartNetwork` 会启动 Web 服务和 TCP 服务。

3. **连接测试**：
   - 其他服务器或客户端可以通过发送 ping 请求来测试与 `BonusService` 的连接。
   - 这可以用于监控和健康检查，确保 `BonusService` 在网络中可用。

### 总结

因此，`BonusService` 被配置为 `ServerRole.Ping` 角色时，确实意味着在启动时会尝试 ping 该服务，以检查连接是否顺利。这种设计有助于确保服务的可用性和网络的健康状态。

## Activator 是干嘛的

`Activator` 是 .NET 中一个非常有用的类，主要用于动态创建对象的实例。它位于 `System` 命名空间中，提供了一些静态方法来实例化类型。

### 主要功能

1. **动态实例化**：

   - `Activator.CreateInstance(Type type)`：根据提供的类型动态创建对象实例。
   - 这对于在运行时不知道具体类型的情况下非常有用。

2. **支持泛型**：

   - `Activator.CreateInstance<T>()`：使用泛型方法创建指定类型的实例。
   - 这种方式更简洁，并且在编译时提供类型安全。

3. **支持构造函数参数**：

   - `Activator.CreateInstance(Type type, object[] args)`：可以传递构造函数参数来创建对象。
   - 这使得可以在创建实例时提供必要的依赖项。

4. **支持非公共构造函数**：
   - `Activator` 还可以用于创建具有非公共构造函数的类型实例，前提是调用者具有适当的权限。

### 使用场景

- **依赖注入**：在依赖注入框架中，`Activator` 可以用于动态创建服务实例。
- **插件系统**：在插件架构中，可以使用 `Activator` 动态加载和实例化插件。
- **工厂模式**：在工厂模式中，可以使用 `Activator` 来创建不同类型的对象。

### 示例代码

```csharp
// 动态创建一个对象实例
var myObject = Activator.CreateInstance(typeof(MyClass));

// 使用泛型创建实例
var myGenericObject = Activator.CreateInstance<MyClass>();

// 创建带参数的实例
var myParameterizedObject = Activator.CreateInstance(typeof(MyClass), new object[] { param1, param2 });
```

### 总结

`Activator` 是一个强大的工具，允许在运行时动态创建对象实例，适用于多种场景，特别是在需要灵活性和动态行为的应用程序中。

## 为什么这里Host.Start();启动了StartNetwork了又调用StopNetwork关闭服务

在 `Host` 类中，`Host.Start()` 方法的流程是为了启动服务器并保持其运行，直到接收到停止信号。具体来说，`StartNetwork` 和 `StopNetwork` 的调用顺序是为了管理服务器的网络服务。以下是详细的解释：

### 启动流程

1. **`Host.Start()` 方法**：

   - 调用 `InternalStart()` 方法来启动服务器的各个组件。
   - 进入一个等待循环，直到接收到停止信号（例如，用户按下 Ctrl+C）。

2. **`InternalStart()` 方法**：
   - 在这个方法中，首先调用 `BeforeStart` 回调（如果有的话）。
   - 然后依次初始化必要的组件，包括：
     - `MetaTable.Instance.Initialize()`
     - `CachePool.Initialize()`
     - `StartConfiguration` 回调（加载配置）
     - `RpcProxy.Initialize()`（初始化RPC）
     - 最后调用 `StartNetwork`，启动网络服务。

### 停止流程

3. **`InternalStop()` 方法**：
   - 当服务器接收到停止信号时，`InternalStop()` 被调用。
   - 在这个方法中，首先调用 `BeforeStop` 回调（如果有的话）。
   - 然后调用 `StopNetwork`，关闭网络服务。
   - 接着停止所有定时器、任务队列和缓存池。

### 总结

- **`StartNetwork`**：用于启动网络服务，允许服务器开始接收和处理请求。
- **`StopNetwork`**：用于关闭网络服务，确保在服务器停止时，所有网络连接都被安全地关闭。

### 目的

这种设计模式确保了服务器在运行时能够正常处理请求，并在需要停止时能够优雅地关闭网络服务，避免潜在的资源泄漏或未处理的请求。这是一个典型的服务器生命周期管理模式，确保了服务的稳定性和可靠性。
