---
title: Session
date: 2024-11-01 17:51:00
tags:
  - unity
---

```c#
using Game.Hotfix.Pages;
using Game.Framework;
using Cysharp.Threading.Tasks;
using Game.Defines;
using System;
using System.Collections.Generic;
using UnityEngine.Networking;
using static Game.Framework.SessionManager;

namespace Game.Hotfix.Managers
{
    public enum NetSessionType
    {
        Logic = 1,
    }
    public class NetSession
    {
        //一个网络会话
        private Session session;
        //是否已经销毁
        private bool disposed = false;
        //会话类型
        private NetSessionType type;

        //等待响应的消息 ID 集合
        private HashSet<int> waitingList = new HashSet<int>();

        public NetSession(Session session, NetSessionType type)
        {
            this.session = session;
            this.type = type;

            this.session.BindBroadcastCallback(OnBroadcast);
            this.session.BindDisconnectedCallback(OnDisconnected);
        }

        //获取会话类型
        public NetSessionType GetSessionType() => type;
        //获取会话 ID
        public ulong GetSessionId() => session == null ? 0 : session.Id;
        //检查会话是否处于活动状态
        public bool IsActive() => session != null && session.Active;
        //是否被双向踢下线
        public bool BiKicked { get; set; }

        //销毁会话
        public void Destroy()
        {
            disposed = true;
            this.session.Dispose();
        }

        //进行身份验证，设置用户 ID 和 token
        public void Auth(int userId, string token)
        {
            this.session.SetAuth(userId, token);
        }

        //处理服务器广播的消息
        private void OnBroadcast(int commandId, byte[] data)
        {
            if (disposed) return;

            NetBroadcastManager.OnHandleBroadcast(this, commandId, data);
        }

        //处理网络断开连接事件
        //errorCode 1主动断开 2网络错误 3网络超时
        private void OnDisconnected(int errorCode)
        {
            if (disposed) return;

            //TODO: 处理重启
            //HotfixMain.Quit("网络断开");

            GameLogger.Log($"Session[{GetSessionId()}][{IsActive()}] is disconnect due to error[{errorCode}]");
            //重启游戏
            //HotfixMain.Reloading("网络错误，请重启游戏".GetText());
        }

        //添加等待响应的消息 ID 到列表，并显示等待界面
        private void AddWaitingMessage(int messageId)
        {
            CommonWaitingPage.Show();

            waitingList.Add(messageId);
        }
        //从等待列表中移除消息 ID，并根据列表是否为空隐藏等待界面
        private void RemoveWaitingMessage(int messageId)
        {
            waitingList.Remove(messageId);

            if (waitingList.Count == 0)
            {
                CommonWaitingPage.Hide();
            }
        }

        //异步发送一个请求消息
        public UniTask SendAsync(IRequestDefine def)
        {
            //检查会话是否销毁，如果是则标记请求为错误并返回
            if (disposed)
            {
                def.Error = ErrorCodeClient.ERR_PeerDisconnect;
                return UniTask.CompletedTask;
            }

            //创建 UniTaskCompletionSource 用于等待响应
            UniTaskCompletionSource tcs = new UniTaskCompletionSource();

            //调用底层会话的 Request 方法发送消息，并提供回调函数处理响应和错误
            var messageId = session.Request(def.CommandId, def.GetInputData()
                , (msgId, bytes, respTime) =>
                 {
                     if (def.ParseOutputData(bytes))
                     {
                         def.Error = ErrorCodeClient.ERR_Success;
                         GameLogger.Log($"Request[{def.CommandId}] success in [{respTime}]ms");
                     }
                     else
                     {
                         def.Error = ErrorCodeClient.ERR_InvalidData;
                         GameLogger.LogError($"Request[{def.CommandId}] failed due to invalid binary data in [{respTime}]ms");
                     }
                     RemoveWaitingMessage(msgId);
                     tcs.TrySetResult();
                 }
                , (msgId, errCode, respTime) =>
                {
                    def.Error = errCode;
                    GameLogger.LogError($"Request[{def.CommandId}] failed with Error[{errCode}] in [{respTime}]ms");
                    RemoveWaitingMessage(msgId);
                    tcs.TrySetResult();
                }, def.Timeout);

            //根据请求配置 (def.Wait) 决定是否显示等待界面
            if (def.Wait) AddWaitingMessage(messageId);

            //返回 UniTask 对象，用于等待发送完成和接收响应
            return tcs.Task;
        }
    }

    //用于存储用户认证信息，包含用户 ID 和 token
    public class SessionAuth
    {
        public int UserId { get; set; }
        public string Token { get; set; }
    }

    //游戏网络管理器的核心类，提供连接、认证、发送消息等功能
    public class NetManager
    {
        static Dictionary<NetSessionType, NetSession> sessions = new Dictionary<NetSessionType, NetSession>();
        static Dictionary<NetSessionType, SessionAuth> auths = new Dictionary<NetSessionType, SessionAuth>();

        //初始化网络广播管理器
        public static void Init()
        {
            NetBroadcastManager.Init();
        }

        //销毁所有网络会话
        public static void Destroy()
        {
            foreach (var session in sessions.Values)
            {
                session.Destroy();
            }

            sessions.Clear();
        }

        //为指定类型的会话进行身份验证
        public static void Auth(NetSessionType type, int userId, string token)
        {
            auths[type] = new SessionAuth
            {
                UserId = userId,
                Token = token
            };

            var session = GetSession(type);
            if (session != null)
            {
                session.Auth(userId, token);
            }
        }

        //获取指定类型的网络会话 (如果不存在则返回 null)
        public static NetSession GetSession(NetSessionType type)
        {
            if (!sessions.TryGetValue(type, out var s)) return null;

            return s;
        }

        //异步连接到服务器，并创建指定类型的网络会话
        public static UniTask<NetSession> ConnectAsync(NetSessionType sessionType, TransportType transportType, string url)
        {
            //移除旧连接
            if (sessions.TryGetValue(sessionType, out var oldSession))
            {
                oldSession.Destroy();
                sessions.Remove(sessionType);
            }

            UniTaskCompletionSource<NetSession> tcs = new UniTaskCompletionSource<NetSession>();

            SessionManager.INSTANCE.ConnectAsync(transportType
                , url
                , (s, time) =>
                {
                    var session = new NetSession(s, sessionType);
                    if (auths.TryGetValue(sessionType, out var auth))
                    {
                        session.Auth(auth.UserId, auth.Token);
                    }
                    sessions[sessionType] = session;

                    tcs.TrySetResult(session);
                }
                , (err) =>
                {
                    tcs.TrySetResult(null);
                });

            return tcs.Task;
        }

        //使用 UnityWebRequest 异步从指定 URL 获取字节数据
        public static async UniTask<byte[]> HttpGetBytesAsync(string url)
        {
            using (var request = UnityWebRequest.Get(url))
            {
                try
                {
                    var req = await request.SendWebRequest().ToUniTask();
                    if (req.result == UnityWebRequest.Result.Success)
                    {
                        return req.downloadHandler.data;
                    }
                    else
                    {
                        GameLogger.LogError($"UnityWebRequest Get[{url}] failed due to error [{req.result}][{req.error}]");
                    }
                }
                catch(Exception e)
                {
                    GameLogger.LogError($"UnityWebRequest Get[{url}] failed due to exception [{e.Message}]");
                }
            }
            return null;
        }

        //使用 HttpGetBytesAsync 获取字节数据，并转成字符串
        public static async UniTask<string> HttpGetStringAsync(string url)
        {
            var bytes = await HttpGetBytesAsync(url);

            if (bytes == null || bytes.Length == 0) return string.Empty;

            return System.Text.Encoding.UTF8.GetString(bytes);
        }
    }
}


```
